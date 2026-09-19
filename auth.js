
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

let currentUser = null;

// Create the Discord login interface.
if (authArea) {
  authArea.hidden = false;

  authArea.innerHTML = `
    <div class="discord-login">

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

const portalText = document.querySelector(
  "#loginDialog .dialog-body > p"
);

function showStatus(message) {
  if (authStatus) {
    authStatus.textContent = message;
  }
}

// Open the Member Portal.
function openMemberPortal(event) {
  event.preventDefault();
  event.stopImmediatePropagation();

  if (loginDialog && !loginDialog.open) {
    loginDialog.showModal();
  }
}

// Main navigation login button.
if (loginButton) {
  loginButton.addEventListener(
    "click",
    openMemberPortal,
    true
  );
}

// Homepage login hotspot.
document.querySelectorAll("[data-open-login]").forEach(
  button => {
    button.addEventListener(
      "click",
      openMemberPortal,
      true
    );
  }
);

// Start Discord login.
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

// Sign out and refresh the website.
discordSignOut?.addEventListener("click", async () => {

  const { error } = await supabase.auth.signOut();

  if (error) {
    showStatus(error.message);
    return;
  }

  currentUser = null;

  updateMemberPortal(null);

  if (loginDialog?.open) {
    loginDialog.close();
  }

  // Refresh automatically so the login button works again.
  window.location.reload();

});

// Update the Member Portal.
function updateMemberPortal(session) {

  const user = session?.user;

  currentUser = user || null;

  if (user) {

    const name =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.user_metadata?.user_name ||
      "Warrior";

    showStatus(`Welcome to the warband, ${name}!`);

    // Hide introductory login text.
    if (portalText) {
      portalText.style.display = "none";
    }

    // Hide Discord login button.
    if (discordSignIn) {
      discordSignIn.hidden = true;
      discordSignIn.style.display = "none";
    }

    // Show sign out button.
    if (discordSignOut) {
      discordSignOut.hidden = false;
      discordSignOut.style.display = "inline-block";
    }

    // Display the player's username.
    if (loginButton) {
      loginButton.textContent = name;
    }

  } else {

    showStatus("");

    // Keep unnecessary text hidden.
    if (portalText) {
      portalText.style.display = "none";
    }

    // Show Discord login.
    if (discordSignIn) {
      discordSignIn.hidden = false;
      discordSignIn.style.display = "inline-block";
    }

    // Hide sign out.
    if (discordSignOut) {
      discordSignOut.hidden = true;
      discordSignOut.style.display = "none";
    }

    // Restore member login button.
    if (loginButton) {
      loginButton.textContent = "MEMBER LOGIN";
    }

  }
}

// Restore existing login session.
const { data: sessionData, error: sessionError } =
  await supabase.auth.getSession();

if (sessionError) {
  showStatus(sessionError.message);
} else {
  updateMemberPortal(sessionData.session);
}

// Listen for authentication changes.
supabase.auth.onAuthStateChange((_event, session) => {
  updateMemberPortal(session);
});
