
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

// Create the account dropdown.
const accountMenu = document.createElement("div");
accountMenu.className = "account-menu";
accountMenu.hidden = true;

const accountSignOut = document.createElement("button");
accountSignOut.type = "button";
accountSignOut.textContent = "SIGN OUT";
accountSignOut.className = "account-signout";

accountMenu.appendChild(accountSignOut);
loginButton?.insertAdjacentElement("afterend", accountMenu);

// Toggle dropdown.
loginButton?.addEventListener("click", () => {
  if (loginButton.dataset.loggedIn === "true") {
    accountMenu.hidden = !accountMenu.hidden;
  }
});

// Sign out from dropdown.
accountSignOut.addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    showStatus(error.message);
  } else {
    accountMenu.hidden = true;
  }
});
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

  const portalText = document.querySelector(
    "#loginDialog .dialog-body > p"
  );

  const discordText = document.querySelector(
    ".discord-login > p"
  );

  if (user) {
    const name =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.user_metadata?.user_name ||
      "Warrior";

    showStatus(`Welcome to the warband, ${name}!`);

    // Hide both introductory sentences.
    if (portalText) portalText.style.display = "none";
    if (discordText) discordText.style.display = "none";

    discordSignIn.style.setProperty(
      "display", "none", "important"
    );

    discordSignOut.style.setProperty(
      "display", "inline-block", "important"
    );

loginButton.textContent = name;
    
loginButton.dataset.loggedIn = "true";
    
loginButton.dataset.loggedIn = "true";

  } else {
    showStatus("Sign in with Discord to enter the warband.");

    // Show the introductory sentences again.
    if (portalText) portalText.style.display = "";
    if (discordText) discordText.style.display = "";

    discordSignIn.style.setProperty(
      "display", "inline-block", "important"
    );

    discordSignOut.style.setProperty(
      "display", "none", "important"
    );

loginButton.textContent = "MEMBER LOGIN";
loginButton.dataset.loggedIn = "false";
accountMenu.hidden = true;
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
