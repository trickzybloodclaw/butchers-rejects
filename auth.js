
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "https://tqiqzxchdeahxalsqjva.supabase.co",
  "sb_publishable_mlgZuCn4H_xD04ZTow2AbQ_RnJFEOjm"
);

const websiteUrl =
  "https://trickzybloodclaw.github.io/butchers-rejects/";

const loginButton = document.getElementById("loginBtn");
const loginDialog = document.getElementById("loginDialog");
const authArea = document.getElementById("authArea");
const authStatus = document.getElementById("authStatus");

let currentUser = null;

// Account dropdown
const accountMenu = document.createElement("div");

accountMenu.id = "guildAccountMenu";
accountMenu.hidden = true;

accountMenu.innerHTML = `
  <button
    id="accountSignOut"
    type="button"
    class="account-signout"
  >
    SIGN OUT
  </button>
`;

if (loginButton) {
  loginButton.insertAdjacentElement("afterend", accountMenu);
}

// Replace old email/password form
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

const accountSignOut =
  document.getElementById("accountSignOut");

const portalInstructions =
  document.querySelector("#loginDialog .dialog-body > p");

// Hide elements reliably
function hide(element) {
  if (!element) return;

  element.hidden = true;

  element.style.setProperty(
    "display",
    "none",
    "important"
  );
}

// Show elements reliably
function show(element, display = "block") {
  if (!element) return;

  element.hidden = false;

  element.style.setProperty(
    "display",
    display,
    "important"
  );
}

function showStatus(message) {
  if (authStatus) {
    authStatus.textContent = message;
  }
}

// Dropdown controls
function closeAccountMenu() {
  hide(accountMenu);
}

function toggleAccountMenu() {
  if (accountMenu.hidden) {
    show(accountMenu);
  } else {
    closeAccountMenu();
  }
}

// Open login or account menu
function handleLoginClick(event) {
  event.preventDefault();
  event.stopImmediatePropagation();

  if (currentUser) {
    toggleAccountMenu();
  } else if (loginDialog && !loginDialog.open) {
    loginDialog.showModal();
  }
}

// Navigation login button
loginButton?.addEventListener(
  "click",
  handleLoginClick,
  true
);

// Homepage login hotspot
document.querySelectorAll("[data-open-login]").forEach(
  button => {
    button.addEventListener(
      "click",
      handleLoginClick,
      true
    );
  }
);

// Close dropdown when clicking elsewhere
document.addEventListener("click", event => {
  if (
    !accountMenu.contains(event.target) &&
    event.target !== loginButton &&
    !event.target.closest("[data-open-login]")
  ) {
    closeAccountMenu();
  }
});

// Start Discord login
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

// Sign out function
async function signOutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    showStatus(error.message);
    return;
  }

  closeAccountMenu();
  updateMemberPortal(null);
}

// Sign out buttons
discordSignOut?.addEventListener(
  "click",
  signOutUser
);

accountSignOut?.addEventListener(
  "click",
  signOutUser
);

// Update the Member Portal
function updateMemberPortal(session) {
  const user = session?.user;

  currentUser = user || null;

  if (user) {

    const name =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.user_metadata?.user_name ||
      "Warrior";

    // Hide login instructions
    hide(portalInstructions);

    // Hide login button
    hide(discordSignIn);

    // Show sign out button
    show(discordSignOut, "inline-block");

    // Display Discord username
    if (loginButton) {
      loginButton.textContent = name;
      loginButton.dataset.loggedIn = "true";
      loginButton.setAttribute(
        "aria-expanded",
        "false"
      );
    }

    showStatus(
      `Welcome to the warband, ${name}!`
    );

  } else {

    // Hide dropdown
    closeAccountMenu();

    // Keep portal clean
    hide(portalInstructions);

    // Show Discord login
    show(discordSignIn, "inline-block");

    // Hide sign out
    hide(discordSignOut);

    // Restore login button
    if (loginButton) {
      loginButton.textContent = "MEMBER LOGIN";
      loginButton.dataset.loggedIn = "false";
      loginButton.setAttribute(
        "aria-expanded",
        "false"
      );
    }

    showStatus("");
  }
}

// Restore existing session
const { data: sessionData, error: sessionError } =
  await supabase.auth.getSession();

if (sessionError) {
  showStatus(sessionError.message);
} else {
  updateMemberPortal(sessionData.session);
}

// Listen for authentication changes
supabase.auth.onAuthStateChange((_event, session) => {
  updateMemberPortal(session);
});
