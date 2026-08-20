/**
 * Dual-purpose contact forms (Employer + Job Seeker).
 *
 * Integration: replace YOUR_WEB3FORMS_ACCESS_KEY in index.html
 * with a key from https://web3forms.com  (free, no backend required).
 * Formspree works the same way — swap the form action if you prefer it.
 */

const employerTab = document.querySelector("#tab-employer");
const seekerTab = document.querySelector("#tab-seeker");
const employerPanel = document.querySelector("#panel-employer");
const seekerPanel = document.querySelector("#panel-seeker");
const preferredRole = document.querySelector("#seeker-role");

function setTab(which) {
  const isEmployer = which === "employer";

  employerTab?.classList.toggle("is-active", isEmployer);
  seekerTab?.classList.toggle("is-active", !isEmployer);
  employerTab?.setAttribute("aria-selected", String(isEmployer));
  seekerTab?.setAttribute("aria-selected", String(!isEmployer));

  if (employerPanel) employerPanel.hidden = !isEmployer;
  if (seekerPanel) seekerPanel.hidden = isEmployer;
}

export function openEmployerTab() {
  setTab("employer");
}

export function openJobSeekerTab() {
  setTab("seeker");
}

export function prefillPreferredRole(title) {
  if (!preferredRole || !title) return;
  preferredRole.value = title;
  preferredRole.dispatchEvent(new Event("change"));
}

function markInvalid(form) {
  form.querySelectorAll("[required]").forEach((field) => {
    field.classList.toggle("is-invalid", !field.checkValidity());
  });
}

function showStatus(form, type, message) {
  const status = form.querySelector("[data-form-status]");
  if (!status) return;
  status.hidden = false;
  status.textContent = message;
  status.className =
    type === "success"
      ? "mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
      : "mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800";
}

async function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  markInvalid(form);

  if (!form.checkValidity()) {
    showStatus(form, "error", "Please complete the required fields highlighted above.");
    return;
  }

  const accessKey = form.querySelector("[name='access_key']")?.value ?? "";
  const submitBtn = form.querySelector("[type='submit']");
  const original = submitBtn?.textContent;
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
  }

  /* Demo / placeholder key — still capture locally so the UI feels complete. */
  if (!accessKey || accessKey.includes("YOUR_WEB3FORMS")) {
    window.setTimeout(() => {
      showStatus(
        form,
        "success",
        "Thank you. Add your Web3Forms access key in index.html to deliver this enquiry to contact@prostafffsolution.com."
      );
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = original;
      }
    }, 600);
    return;
  }

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: new FormData(form),
    });
    const result = await response.json();

    if (result.success) {
      showStatus(form, "success", "Thank you. Our team will get back to you shortly.");
      form.reset();
    } else {
      showStatus(form, "error", result.message || "Something went wrong. Please email us directly.");
    }
  } catch {
    showStatus(form, "error", "Network error. Please try again or email contact@prostafffsolution.com.");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = original;
    }
  }
}

export function initForms() {
  employerTab?.addEventListener("click", () => setTab("employer"));
  seekerTab?.addEventListener("click", () => setTab("seeker"));

  document.querySelector("#employer-form")?.addEventListener("submit", handleSubmit);
  document.querySelector("#seeker-form")?.addEventListener("submit", handleSubmit);

  document.querySelectorAll("[data-open-employer]").forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      openEmployerTab();
    });
  });

  document.querySelectorAll("[data-open-seeker]").forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      openJobSeekerTab();
    });
  });

  const fileInput = document.querySelector("#seeker-resume");
  const fileName = document.querySelector("#resume-filename");
  const fileDrop = document.querySelector("#resume-drop");

  fileInput?.addEventListener("change", () => {
    if (fileName) {
      fileName.textContent = fileInput.files?.[0]?.name || "PDF, DOC, or DOCX up to 5 MB";
    }
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    fileDrop?.addEventListener(eventName, (event) => {
      event.preventDefault();
      fileDrop.classList.add("is-dragover");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    fileDrop?.addEventListener(eventName, (event) => {
      event.preventDefault();
      fileDrop.classList.remove("is-dragover");
    });
  });

  fileDrop?.addEventListener("drop", (event) => {
    const files = event.dataTransfer?.files;
    if (files?.length && fileInput) {
      fileInput.files = files;
      fileInput.dispatchEvent(new Event("change"));
    }
  });
}
