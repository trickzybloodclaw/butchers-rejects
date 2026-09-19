
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl =
  "https://tqiqzxchdeahxalsqjva.supabase.co";

const supabaseKey =
  "sb_publishable_mlgZuCn4H_xD04ZTow2AbQ_RnJFEOjm";

const supabase = createClient(supabaseUrl, supabaseKey);

const websiteUrl =
  "https://trickzybloodclaw.github.io/butchers-rejects/";

const loginButton = document.getElementById("loginBtn");
const loginDialog = document.getElementById("loginDialog");
const authArea = document.getElementById("authArea");
const authStatus = document.getElementById("authStatus");

// Replace the old email/password interface with Discord login.
if (authArea) {
  authArea.hidden = false;
  authArea.innerHTML = `
    <div class="discord-login">
      <p>Enter the warband using your Discord account.</p>

      <button
        id="discordSignIn"
        type="button"
        class="btn primary"
      >
        LOGIN WITH DISCORD
      </button>

      <button
        id="discordSignOut"
        type="button"
        class="btn secondary"
        hidden
      >
        SIGN OUT
      </button>
    </div>
  `;
}

const discordSignIn =
  document.getElementById("discordSignIn");

const discordSignOut =
  document.getElementById("discordSignOut");

function showStatus(message) {
  if (authStatus) {
    authStatus.textContent = message;
  }
}

// Open the existing Member Portal.
if (loginButton && loginDialog) {
  loginButton.addEventListener(
    "click",
    (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();

      if (!loginDialog.open) {
        loginDialog.showModal();
      }
    },
    true
  );
}

// Start Discord authentication.
discordSignIn?.addEventListener("click", async () => {
  showStatus("Connecting to Discord...");

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: websiteUrl
    }
  });

  if (error) {
    showStatus(error.message);
  }
});

// Sign out.
discordSignOut?.addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    showStatus(error.message);
  }
});

// Update the Member Portal when authentication changes.
function updateMemberPortal(session) {
  const user = session?.user;

  if (user) {
    const name =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.user_metadata?.user_name ||
      "Warrior";

    showStatus(`Welcome to the warband, ${name}!`);

    if (discordSignIn) {
      discordSignIn.hidden = true;
    }

    if (discordSignOut) {
      discordSignOut.hidden = false;
    }

    if (loginButton) {
      loginButton.textContent = "MY ACCOUNT";
    }
  } else {
    showStatus("Sign in with Discord to enter the warband.");

    if (discordSignIn) {
      discordSignIn.hidden = false;
    }

    if (discordSignOut) {
      discordSignOut.hidden = true;
    }

    if (loginButton) {
      loginButton.textContent = "MEMBER LOGIN";
    }
  }
}

// Check for an existing login session.
const { data: sessionData, error: sessionError } =
  await supabase.auth.getSession();

if (sessionError) {
  showStatus(sessionError.message);
} else {
  updateMemberPortal(sessionData.session);
}

// Listen for sign-in and sign-out events.
supabase.auth.onAuthStateChange((_event, session) => {
  updateMemberPortal(session);
});
