export function renderSocialIcons() {
  const socialLinks = [
    {
      href: "https://github.com/kalellz",
      src: "/icons/github.svg",
      alt: "GitHub",
      label: "GitHub"
    },
    {
      href: "https://wa.me/5511952443450",
      src: "/icons/wpp.svg",
      alt: "WhatsApp",
      label: "WhatsApp"
    },
    {
      href: "https://www.linkedin.com/in/kalel-rodrigues-silva/",
      src: "/icons/linkedin.svg",
      alt: "LinkedIn",
      label: "LinkedIn"
    },
    {
      href: "mailto:kalel.rodrigues@icloud.com",
      src: "/icons/email.svg",
      alt: "Email",
      label: "Email"
    }
  ];

  const container = document.getElementById("social-bar");
  if (!container) return;

  socialLinks.forEach(({ href, src, alt, label }) => {
    const wrapper = document.createElement("div");
    wrapper.className = "social-icon";

    wrapper.innerHTML = `
      <a href="${href}" target="_blank">
        <img src="${src}" alt="${alt}" />
      </a>
      <span class="tooltip">${label}</span>
    `;

    container.appendChild(wrapper);
  });
}
