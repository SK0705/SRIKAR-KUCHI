const SCRIPT_URL = "/api/contact";

// The contact form submits via Vercel API endpoint which forwards to Google Apps Script.
// This file enhances the submission experience with premium UI states.
const form = document.getElementById("contact-form");
const submitButton = document.querySelector(".btn-submit");
const formControls = form ? Array.from(form.querySelectorAll("input, textarea")) : [];
const successToastDuration = 4000;

if (form && submitButton) {
    createToastContainer();

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !subject || !message) {
            showToast({
                type: "error",
                title: "Incomplete Form",
                message: "Please fill in every field before sending your message."
            });
            return;
        }

        setLoadingState();

        const payload = {
            name,
            email,
            subject,
            message
        };

        try {
            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                console.log("Message submitted successfully");
                setSuccessState();
                showToast({
                    type: "success",
                    title: "Message Sent Successfully",
                    message: "Thank you for reaching out. Your message has been delivered successfully. I'll get back to you as soon as possible."
                });

                form.reset();
                form.classList.add("is-resetting");
                window.setTimeout(() => {
                    form.classList.remove("is-resetting");
                }, 350);

                window.setTimeout(() => {
                    resetButtonState();
                }, 1800);
            } else {
                throw new Error(data.error || 'Submission failed');
            }

        } catch (error) {
            console.error("Submission Error:", error);
            setErrorState();
            showToast({
                type: "error",
                title: "Message Not Sent",
                message: "Your message could not be delivered. Please try again in a moment."
            });
        }
    });
}

function createToastContainer() {
    if (document.getElementById("contact-toast-root")) {
        return;
    }

    const toastRoot = document.createElement("div");
    toastRoot.id = "contact-toast-root";
    toastRoot.className = "contact-toast-root";
    document.body.appendChild(toastRoot);
}

function showToast({ type, title, message }) {
    const toastRoot = document.getElementById("contact-toast-root");
    if (!toastRoot) {
        return;
    }

    const toast = document.createElement("div");
    toast.className = `contact-toast ${type}`;
    toast.innerHTML = `
        <div class="contact-toast-icon" aria-hidden="true"></div>
        <div class="contact-toast-content">
            <strong>${title}</strong>
            <p>${message}</p>
        </div>
    `;

    toastRoot.appendChild(toast);

    window.requestAnimationFrame(() => {
        toast.classList.add("is-visible");
    });

    window.clearTimeout(toast._dismissTimer);
    toast._dismissTimer = window.setTimeout(() => {
        toast.classList.remove("is-visible");
        window.setTimeout(() => toast.remove(), 250);
    }, successToastDuration);
}

function setLoadingState() {
    setFormEnabled(false);
    submitButton.classList.remove("is-success", "is-error");
    submitButton.classList.add("is-loading");
    submitButton.disabled = true;
    submitButton.setAttribute("aria-busy", "true");
    submitButton.querySelector(".submit-label").textContent = "Sending...";
}

function setSuccessState() {
    submitButton.classList.remove("is-loading", "is-error");
    submitButton.classList.add("is-success");
    submitButton.disabled = true;
    submitButton.querySelector(".submit-label").textContent = "Sent!";
    createBurstParticles();
}

function setErrorState() {
    submitButton.classList.remove("is-loading", "is-success");
    submitButton.classList.add("is-error");
    submitButton.disabled = false;
    submitButton.setAttribute("aria-busy", "false");
    submitButton.querySelector(".submit-label").textContent = "Try Again";
    setFormEnabled(true);
}

function resetButtonState() {
    submitButton.classList.remove("is-loading", "is-success", "is-error");
    submitButton.disabled = false;
    submitButton.setAttribute("aria-busy", "false");
    submitButton.querySelector(".submit-label").textContent = "Send Message";
    setFormEnabled(true);
}

function setFormEnabled(isEnabled) {
    formControls.forEach((control) => {
        control.disabled = !isEnabled;
        control.classList.toggle("is-disabled", !isEnabled);
    });
}

function createBurstParticles() {
    const burst = document.createElement("span");
    burst.className = "submit-particles";
    burst.setAttribute("aria-hidden", "true");

    const particleColors = ["#ffffff", "#a78bfa", "#34d399", "#fbbf24"];

    for (let index = 0; index < 12; index += 1) {
        const particle = document.createElement("span");
        particle.className = "particle";
        const angle = (index / 12) * Math.PI * 2;
        const distance = 18 + (index % 4) * 8;
        particle.style.setProperty("--particle-x", `${Math.cos(angle) * distance}px`);
        particle.style.setProperty("--particle-y", `${Math.sin(angle) * distance}px`);
        particle.style.background = particleColors[index % particleColors.length];
        burst.appendChild(particle);
    }

    submitButton.appendChild(burst);

    window.requestAnimationFrame(() => {
        burst.classList.add("is-active");
    });

    window.setTimeout(() => {
        burst.remove();
    }, 900);
}