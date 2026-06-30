<!DOCTYPE html><html class="dark" lang="en" style=""><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Connect Jira Workspace | JiraAutoTest</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&amp;family=JetBrains+Mono:wght@100..800&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "inverse-primary": "#6d3bd7",
                    "on-tertiary-container": "#00311f",
                    "tertiary-container": "#00a572",
                    "on-secondary": "#002e6a",
                    "surface-container-lowest": "#060e20",
                    "surface-container-low": "#131b2e",
                    "on-error": "#690005",
                    "on-surface-variant": "#cbc3d7",
                    "tertiary-fixed": "#6ffbbe",
                    "on-primary": "#3c0091",
                    "secondary-container": "#0566d9",
                    "primary": "#d0bcff",
                    "on-primary-container": "#340080",
                    "surface-container": "#171f33",
                    "surface": "#0b1326",
                    "on-error-container": "#ffdad6",
                    "secondary-fixed": "#d8e2ff",
                    "on-secondary-fixed-variant": "#004395",
                    "surface-variant": "#2d3449",
                    "surface-dim": "#0b1326",
                    "primary-fixed": "#e9ddff",
                    "secondary-fixed-dim": "#adc6ff",
                    "on-surface": "#dae2fd",
                    "on-primary-fixed": "#23005c",
                    "primary-container": "#a078ff",
                    "inverse-surface": "#dae2fd",
                    "surface-tint": "#d0bcff",
                    "inverse-on-surface": "#283044",
                    "secondary": "#adc6ff",
                    "on-tertiary-fixed": "#002113",
                    "on-secondary-fixed": "#001a42",
                    "on-primary-fixed-variant": "#5516be",
                    "on-background": "#dae2fd",
                    "on-tertiary": "#003824",
                    "outline-variant": "#494454",
                    "surface-container-highest": "#2d3449",
                    "tertiary": "#4edea3",
                    "surface-bright": "#31394d",
                    "on-secondary-container": "#e6ecff",
                    "background": "#0b1326",
                    "tertiary-fixed-dim": "#4edea3",
                    "error-container": "#93000a",
                    "surface-container-high": "#222a3d",
                    "error": "#ffb4ab",
                    "primary-fixed-dim": "#d0bcff",
                    "outline": "#958ea0",
                    "on-tertiary-fixed-variant": "#005236"
            },
            "borderRadius": {
                    "DEFAULT": "0.125rem",
                    "lg": "0.25rem",
                    "xl": "0.5rem",
                    "full": "0.75rem"
            },
            "spacing": {
                    "gutter": "24px",
                    "xl": "32px",
                    "md": "16px",
                    "base": "4px",
                    "xs": "4px",
                    "container-max": "1440px",
                    "sm": "8px",
                    "2xl": "48px",
                    "lg": "24px",
                    "3xl": "64px"
            },
            "fontFamily": {
                    "headline-lg-mobile": ["Geist"],
                    "display": ["Geist"],
                    "headline-lg": ["Geist"],
                    "title-lg": ["Geist"],
                    "label-md": ["Geist"],
                    "headline-md": ["Geist"],
                    "code": ["JetBrains Mono"],
                    "body-md": ["Geist"],
                    "body-lg": ["Geist"]
            },
            "fontSize": {
                    "headline-lg-mobile": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                    "display": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                    "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                    "title-lg": ["20px", {"lineHeight": "28px", "fontWeight": "500"}],
                    "label-md": ["12px", {"lineHeight": "16px", "letterSpacing": "0.02em", "fontWeight": "500"}],
                    "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                    "code": ["13px", {"lineHeight": "18px", "fontWeight": "400"}],
                    "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                    "body-lg": ["16px", {"lineHeight": "24px", "fontWeight": "400"}]
            }
          },
        },
      }
    </script>
<style>
        body {
            background-color: #0f172a; /* Slate-900 override for brand base */
            font-family: 'Geist', sans-serif;
        }
        .cyber-gradient {
            background: linear-gradient(135deg, #a078ff 0%, #6d3bd7 100%);
        }
        .border-glow:focus-within {
            border-color: #d0bcff;
            box-shadow: 0 0 0 2px rgba(208, 188, 255, 0.2);
        }
        .glass-nav {
            backdrop-filter: blur(12px);
            background-color: rgba(11, 19, 38, 0.7);
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
    </style>
</head>
<body class="text-on-surface min-h-screen flex flex-col">
<!-- TopNavBar (Shared Component) -->
<header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-lg py-md glass-nav border-b border-outline-variant/30">
<div class="flex items-center gap-md">
<span class="font-headline-md text-headline-md font-bold text-primary">JiraAutoTest</span>
</div>
<nav class="hidden md:flex items-center gap-xl">
<a class="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Documentation</a>
<a class="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">System Status</a>
<a class="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Security</a>
</nav>
<div class="flex items-center gap-md"><div class="flex items-center gap-md"><div class="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-label-md">JD</div><button class="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors px-md py-sm flex items-center gap-xs"><span class="material-symbols-outlined text-md">logout</span>Logout</button></div></div>
</header>
<main class="flex-grow pt-3xl pb-2xl px-gutter md:px-3xl flex items-center justify-center">
<div class="max-w-container-max w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-xl items-stretch">
<!-- Left Column: Integration Form -->
<div class="md:col-span-7 lg:col-span-6">
<div class="bg-surface-container-low border border-outline-variant/50 rounded-xl p-lg md:p-xl shadow-2xl transition-all duration-300">
<div class="mb-xl">
<h1 class="font-headline-md text-headline-md md:font-headline-lg md:text-headline-lg text-primary mb-xs">Connect Your Jira Site</h1>
<p class="font-body-md text-body-md text-on-surface-variant">Configure your credentials to sync automation tests with Jira Cloud.</p>
</div>
<form class="space-y-lg" id="jiraForm">
<!-- Workspace Name -->
<div class="space-y-xs">
<label class="font-label-md text-label-md text-on-surface-variant ml-1">Workspace Name</label>
<input class="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm text-on-surface placeholder:text-outline focus:outline-none border-glow transition-all" placeholder="e.g.,  First workspace" type="text">
</div>
<!-- Jira Site URL -->
<div class="space-y-xs">
<label class="font-label-md text-label-md text-on-surface-variant ml-1">Jira Site URL</label>
<div class="flex items-stretch border border-outline-variant rounded-lg bg-surface-container-lowest overflow-hidden border-glow transition-all">
<span class="flex items-center px-md border-r border-outline-variant text-outline font-code text-code">https://</span>
<input class="flex-grow bg-transparent border-none px-md py-sm text-on-surface focus:ring-0 placeholder:text-outline font-code text-code" placeholder="your-site" type="text">
<span class="flex items-center px-md bg-surface-variant text-on-surface-variant font-code text-code">.atlassian.net</span>
</div>
</div>
<!-- Email Address -->
<div class="space-y-xs">
<label class="font-label-md text-label-md text-on-surface-variant ml-1">Atlassian Email Address</label>
<input class="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm text-on-surface placeholder:text-outline focus:outline-none border-glow transition-all" placeholder="name@company.com" type="email">
</div>
<!-- API Token -->
<div class="space-y-xs relative">
<label class="font-label-md text-label-md text-on-surface-variant ml-1">Jira API Token</label>
<div class="relative">
<input class="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm text-on-surface placeholder:text-outline focus:outline-none border-glow transition-all pr-xl" id="apiToken" placeholder="••••••••••••••••" type="password">
<button class="absolute right-md top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors" onclick="togglePassword()" type="button">
<span class="material-symbols-outlined" id="toggleIcon">visibility</span>
</button>
</div>
</div>
<!-- Actions -->
<div class="flex flex-col sm:flex-row gap-md pt-md">
<button class="flex items-center justify-center gap-sm px-lg py-md border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface hover:bg-surface-variant transition-all hover:shadow-[0_0_15px_rgba(208,188,255,0.1)]" type="button">
<span class="material-symbols-outlined text-md">power</span>
                                Test Connection
                            </button>
<button class="flex-grow px-lg py-md rounded-lg cyber-gradient text-on-primary font-bold font-body-md text-body-md opacity-50 cursor-not-allowed transition-all" disabled="true">
                                Create Workspace
                            </button>
</div>
</form>
</div>
</div>
<!-- Right Column: Helper Guide -->
<div class="md:col-span-5 lg:col-span-6 flex flex-col justify-center">
<div class="border border-dashed border-outline-variant rounded-xl p-lg md:p-xl space-y-xl bg-surface/30">
<div>
<h2 class="font-title-lg text-title-lg text-on-surface flex items-center gap-sm">
<span class="material-symbols-outlined text-primary">help_outline</span>
                            How to get your Jira API Token?
                        </h2>
</div>
<ul class="space-y-lg"><li class="flex items-start gap-md"><span class="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-md text-label-md shrink-0 mt-1">1</span><p class="font-body-md text-body-md text-on-surface-variant">Go to the <a class="text-primary font-bold hover:underline transition-colors" href="https://id.atlassian.com/manage-profile/security/api-tokens">https://id.atlassian.com/manage-profile/security/api-tokens</a>.</p></li><li class="flex items-start gap-md"><span class="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-md text-label-md shrink-0 mt-1">2</span><p class="font-body-md text-body-md text-on-surface-variant">Log in with your Atlassian account if prompted.</p></li><li class="flex items-start gap-md"><span class="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-md text-label-md shrink-0 mt-1">3</span><p class="font-body-md text-body-md text-on-surface-variant">Click the blue 'Create API token' button.</p></li><li class="flex items-start gap-md"><span class="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-md text-label-md shrink-0 mt-1">4</span><p class="font-body-md text-body-md text-on-surface-variant">Enter a label (e.g., 'JiraAutoTest'), click Create, and copy the token to paste here.</p></li></ul>
<div class="flex items-center gap-md p-md bg-tertiary-container/10 border border-tertiary/20 rounded-lg">
<span class="material-symbols-outlined text-tertiary" data-weight="fill">shield</span>
<p class="font-label-md text-label-md text-tertiary-fixed">
                            Security Note: Your API Token is encrypted at rest using AES-256 and is never stored in plain text.
                        </p>
</div>
<!-- Decorative Element -->
<div class="mt-xl hidden lg:flex items-center justify-between gap-md py-lg w-full">
  <!-- Node 1: Jira Token -->
  <div class="flex flex-col items-center gap-xs bg-surface-container-high p-md rounded-xl border border-outline-variant shadow-[0_0_15px_rgba(160,120,255,0.1)] hover:shadow-[0_0_20px_rgba(160,120,255,0.2)] transition-shadow duration-300 shrink-0">
    <span class="material-symbols-outlined text-primary">vpn_key</span>
    <span class="text-label-md font-bold text-on-surface">Jira Token</span>
  </div>

  <!-- Connector -->
  <div class="flex-grow flex flex-col items-center gap-xs">
    <span class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Encrypted Sync</span>
    <div class="w-full flex items-center gap-xs">
      <div class="flex-grow border-t border-dashed border-outline-variant/50"></div>
      <span class="material-symbols-outlined text-primary animate-pulse text-md">arrow_forward</span>
      <div class="flex-grow border-t border-dashed border-outline-variant/50"></div>
    </div>
  </div>

  <!-- Node 2: Workspace Connected -->
  <div class="flex flex-col items-center gap-xs bg-surface-container-high p-md rounded-xl border border-primary/30 shadow-[0_0_15px_rgba(111,251,190,0.1)] hover:shadow-[0_0_20px_rgba(111,251,190,0.2)] transition-shadow duration-300 shrink-0">
    <span class="material-symbols-outlined text-tertiary">verified_user</span>
    <span class="text-label-md font-bold text-on-surface">Workspace Connected</span>
  </div>
</div>
</div>
</div>
</div>
</main>
<!-- Footer (Shared Component) -->
<footer class="w-full py-lg px-2xl flex flex-col md:flex-row justify-between items-center gap-md bg-surface-container-lowest border-t border-outline-variant/30">
<div class="flex items-center gap-md">
<span class="font-title-lg text-title-lg text-on-surface">JiraAutoTest</span>
</div>
<div class="flex gap-lg">
<a class="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
<a class="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">Terms of Service</a>
<a class="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">Cookie Settings</a>
</div>
<p class="font-label-md text-label-md text-on-surface-variant opacity-60">© 2024 JiraAutoTest Engine. All rights reserved.</p>
</footer>
<script>
        function togglePassword() {
            const input = document.getElementById('apiToken');
            const icon = document.getElementById('toggleIcon');
            if (input.type === 'password') {
                input.type = 'text';
                icon.textContent = 'visibility_off';
            } else {
                input.type = 'password';
                icon.textContent = 'visibility';
            }
        }

        // Logic for "disabled state" button - simulated validation
        const inputs = document.querySelectorAll('#jiraForm input');
        const createBtn = document.querySelector('button[disabled]');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                const allFilled = Array.from(inputs).every(i => i.value.trim().length > 0);
                if (allFilled) {
                    createBtn.removeAttribute('disabled');
                    createBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                    createBtn.classList.add('hover:scale-105', 'active:scale-95');
                } else {
                    createBtn.setAttribute('disabled', 'true');
                    createBtn.classList.add('opacity-50', 'cursor-not-allowed');
                    createBtn.classList.remove('hover:scale-105', 'active:scale-95');
                }
            });
        });
    </script>


</body></html>