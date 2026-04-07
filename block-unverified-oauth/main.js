
/// 🦇 Appwrite Function: block-unverified-oauth

  // Trigger: users.*.sessions.*.create

  // Purpose: Prevent unverified users from linking OAuth (Google, GitHub, etc.)



import { Client, Users } from "node-appwrite";



export default async ({ req, res, log, error, env }) =>
{
  try
  {
    // --- 1️⃣ Initialize Appwrite Admin client ---
  
      const client = new Client()
    
        .setEndpoint(
          
          env?.APPWRITE_FUNCTION_API_ENDPOINT ||
          
          process.env.APPWRITE_FUNCTION_API_ENDPOINT
        )
        
        .setProject(
          
          env?.APPWRITE_FUNCTION_PROJECT_ID ||
            
          process.env.APPWRITE_FUNCTION_PROJECT_ID
        )
        
        .setKey(
          
          env?.APPWRITE_API_KEY ||
          
          process.env.APPWRITE_API_KEY

        );

      
      const users = new Users(client);



    // --- 2️⃣ Parse incoming event payload safely ---
    
      let body;
      
      if (typeof req.body === "object" && req.body !== null)
      {
        body = req.body;
      } 
      
      else
      {
        try
        {
          body = req.body ? JSON.parse(req.body) : {};
        }
        
        catch
        {
          log("⚠️ Could not parse req.body as JSON, using empty object.");
        
          body = {};
        }
      }

      
      log(`🧩 Raw event body: ${JSON.stringify(body)}`);

    
    
    // --- 3️⃣ Extract user ID and provider ---
    
      const userId =
      
        body?.userId ||
        
        body?.user_id ||
        
        body?.user?.$id ||
        
        body?.$userId ||
        
        body?.userId?.$id ||
        
        null;

      
      const provider = body?.provider || null;


      if (!userId)
      {
        log("❌ No userId found in payload. Skipping.");
      
        return res.json({ status: "skipped", reason: "no_user_id" });
      }

      
      log(`✅ Received OAuth session create event for userId: ${userId}`);

    
    
    // --- 4️⃣ Skip non-OAuth logins ---
    
      if (!provider || provider === "" || provider === "email")
      {
        log(`ℹ️ Detected non-OAuth session (${provider || "none"}) for userId=${userId} — skipping.`);
        
        return res.json({ skipped: true, reason: "non_oauth_session" });
      }

      
      log(`📩 OAuth session created via provider: ${provider} for userId=${userId}`);



    // --- 5️⃣ Fetch full user info ---
    
      let user;
      
      try
      {
        user = await users.get(userId);
      }
      
      catch (err)
      {
        error(`❌ Failed to fetch user ${userId}: ${err.message}`);
      
        return res.json(
          
          { status: "error", reason: "user_fetch_failed", details: err.message },
          
          200

        );
      }

      
      log(`👤 User: ${user.email} | emailVerification=${user.emailVerification}`);

    
    
    // --- 6️⃣ If unverified → block + delete sessions + unlink OAuth ---
    
      if (!user.emailVerification)
      {
        log(`🚫 Unverified user detected: ${user.email}. Blocking OAuth link...`);


        // 🧹 Delete all sessions
        
        try
        {
          await users.deleteSessions(userId);
        
          log(`🧹 All sessions deleted for ${user.email}`);
        }
        
        catch (sessErr)
        {
          error(`⚠️ Failed to delete sessions: ${sessErr.message}`);
        }


        // // 🧹 Delete all linked identities (Google, GitHub, etc.)
        // try {
        //   const apiEndpoint =
        //     env?.APPWRITE_FUNCTION_API_ENDPOINT ||
        //     process.env.APPWRITE_FUNCTION_API_ENDPOINT ||
        //     client.config.endpoint ||
        //     "https://cloud.appwrite.io/v1";


        //   log(`🔧 Endpoint: ${apiEndpoint}`);
        //   log(`🔧 Project: ${process.env.APPWRITE_FUNCTION_PROJECT_ID}`);

          
          
        //   const response = await fetch(
        //     `${apiEndpoint.replace(/\/$/, "")}/users/${userId}/identities/`, // ← FIXED trailing slash
        //     {
        //       method: "GET",
        //       headers: {
        //         "X-Appwrite-Project":
        //           env?.APPWRITE_FUNCTION_PROJECT_ID ||
        //           process.env.APPWRITE_FUNCTION_PROJECT_ID,
        //         "X-Appwrite-Key":
        //           env?.APPWRITE_API_KEY || process.env.APPWRITE_API_KEY,
        //       },
        //     }
        //   );

        //   if (!response.ok) {
        //     throw new Error(
        //       `Failed to fetch identities: ${response.status} ${response.statusText}`
        //     );
        //   }

        //   const identitiesList = await response.json();
        //   log(
        //     `🧩 identitiesList (manual fetch) raw: ${JSON.stringify(
        //       identitiesList
        //     )}`
        //   );

        //   const identities =
        //     identitiesList.identities || identitiesList.users || [];

        //   log(`🔍 Found ${identities.length} linked identities for ${user.email}`);

        //   for (const id of identities) {
        //     const identityId = id.$id || id.id;
        //     const providerName = id.provider || id.providerId || "(unknown)";

        //     try {
        //       await users.deleteIdentity(userId, identityId);
        //       log(`✅ Deleted identity ${providerName} (${identityId})`);
        //     } catch (delErr) {
        //       error(
        //         `⚠️ Could not delete ${providerName}: ${delErr.message || delErr}`
        //       );
        //     }
        //   }
        // } catch (idErr) {
        //   error(`⚠️ Failed to list/delete identities: ${idErr.message}`);
        // }


        log(`❌ OAuth session blocked for unverified user: ${user.email}`);
        
        return res.json({ blocked: true, reason: "email_not_verified" }, 200);
      }



    // --- 7️⃣ Verified user → allow login ---
    
      log("✅ Verified user or non-OAuth login — session allowed.");
      
      return res.json({ blocked: false, reason: "verified_or_non_oauth" }, 200);
  }
  
  catch (err)
  {
    error(`🔥 Unexpected function error: ${err.message}`);
  
    
    return res.json(
      
      { error: "unhandled_exception", details: err.message },
      
      500

    );
  }
};