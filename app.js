
const config = window.GUILD_CONFIG || {};
const data = window.GUILD_DATA || {};

const $ = id => document.getElementById(id);

const safeText = (tag, text, cls) => {
  const e = document.createElement(tag);
  e.textContent = text || "";

  if (cls) {
    e.className = cls;
  }

  return e;
};

// ==========================================
// GUILD ROSTER
// ==========================================

const roster = $("rosterCards");

if (roster) {
  (data.roster || []).forEach(m => {
    const card = safeText("article", "", "member");
    const avatar = safeText("div", "", "avatar");

    if (m.image) {
      const img = document.createElement("img");
      img.src = m.image;
      img.alt = m.name || "Guild member";
      img.loading = "lazy";

      // Fit the picture inside the existing avatar square.
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.style.display = "block";

      avatar.style.overflow = "hidden";
      avatar.style.padding = "0";

      // Show the initials if the picture cannot be loaded.
      img.addEventListener("error", () => {
        img.remove();
        avatar.textContent = m.initial || "⚔";
      }, { once: true });

      avatar.append(img);
    } else {
      avatar.textContent = m.initial || "⚔";
    }

    card.append(
      avatar,
      safeText("span", m.role, "role"),
      safeText("h3", m.name),
      safeText("p", m.className)
    );

    roster.append(card);
  });
}

// ==========================================
// GUILD NEWS
// ==========================================

const news = $("newsCards");

if (news) {
  (data.news || []).forEach(n => {
    const card = safeText("article", "", "news-card");

    card.append(
      safeText("span", n.date, "date"),
      safeText("h3", n.title),
      safeText("p", n.body)
    );

    news.append(card);
  });
}

// ==========================================
// GUILD GALLERY
// ==========================================

const gallery = $("galleryCards");

if (gallery) {
  (data.gallery || []).forEach(g => {
    const card = safeText("article", "", "gallery-card");
    const visual = safeText("div", "", "gallery-image");
    const copy = safeText("div", "", "copy");

    if (g.image) {
      const img = document.createElement("img");

      img.src = g.image;
      img.alt = g.title || "Guild screenshot";
      img.loading = "lazy";

      visual.append(img);
    } else {
      visual.textContent = "⚔";
    }

    copy.append(
      safeText("h3", g.title),
      safeText("p", g.caption)
    );

    card.append(visual, copy);
    gallery.append(card);
  });
}

// ==========================================
// MOBILE NAVIGATION
// ==========================================

const menu = $("menu");
const nav = $("nav");

if (menu && nav) {
  menu.addEventListener("click", () => {
    const open = nav.classList.toggle("open");

    menu.setAttribute(
      "aria-expanded",
      String(open)
    );
  });

  document.querySelectorAll("#nav a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");

      menu.setAttribute(
        "aria-expanded",
        "false"
      );
    });
  });
}

// ==========================================
// RECRUITMENT APPLICATIONS
// FORMSPREE EMAIL DELIVERY
// ==========================================

const formspreeEndpoint =
  "https://formspree.io/f/mppwqwoy";

const applyForm = $("applyForm");
const applyStatus = $("applyStatus");

if (applyForm) {

  applyForm.addEventListener("submit", async event => {

    event.preventDefault();

    const submitButton = applyForm.querySelector(
      'button[type="submit"]'
    );

    // Prevent duplicate submissions.
    if (submitButton?.disabled) {
      return;
    }

    if (!applyForm.reportValidity()) {
      return;
    }

    const formData = new FormData(applyForm);

    const character = String(
      formData.get("character") || ""
    ).trim();

    const classSpec = String(
      formData.get("classSpec") || ""
    ).trim();

    const experience = String(
      formData.get("experience") || ""
    ).trim();

    const message = String(
      formData.get("message") || ""
    ).trim();

    if (!character || !classSpec || !experience) {
      if (applyStatus) {
        applyStatus.textContent =
          "Please complete all required fields.";
      }

      return;
    }

    // Include a useful email subject.
    formData.set(
      "_subject",
      `New Guild Application: ${character}`
    );

    formData.set(
      "message",
      message || "(No message provided)"
    );

    // Identify the source of the application.
    formData.set(
      "guild",
      "The Butchers Rejects"
    );

    const originalButtonText =
      submitButton?.textContent;

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent =
        "SENDING APPLICATION...";
    }

    if (applyStatus) {
      applyStatus.textContent =
        "Sending your application to the warband...";
    }

    try {

      const response = await fetch(
        formspreeEndpoint,
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json"
          }
        }
      );

      if (!response.ok) {

        let errorMessage =
          "Your application could not be sent. Please try again.";

        try {
          const result = await response.json();

          if (
            result.errors &&
            result.errors.length > 0
          ) {
            errorMessage = result.errors
              .map(error => error.message)
              .join(" ");
          }

        } catch (_) {
          // Keep the default error message.
        }

        throw new Error(errorMessage);
      }

      // Application accepted by Formspree.
      if (applyStatus) {
        applyStatus.textContent =
          "Application submitted successfully! " +
          "The warband has received your request.";
      }

      // Clear the form after success.
      applyForm.reset();

    } catch (error) {

      console.error(
        "Guild application error:",
        error
      );

      if (applyStatus) {
        applyStatus.textContent =
          "Application failed: " +
          (error.message ||
            "Please try again later.");
      }

    } finally {

      if (submitButton) {
        submitButton.disabled = false;

        submitButton.textContent =
          originalButtonText;
      }

    }

  });

}

// ==========================================
// MEMBER PORTAL
// ==========================================

const dialog = $("loginDialog");

// Open the existing Member Portal.
function openMemberPortal(event) {

  if (event) {
    event.preventDefault();
  }

  if (dialog && !dialog.open) {
    dialog.showModal();
  }

}

// Main navigation login button.
const loginButton = $("loginBtn");

if (loginButton) {
  loginButton.addEventListener(
    "click",
    openMemberPortal
  );
}

// Homepage login hotspot.
document.querySelectorAll(
  "[data-open-login]"
).forEach(button => {

  button.addEventListener(
    "click",
    openMemberPortal
  );

});

// Supabase Discord authentication
// remains handled by auth.js.
