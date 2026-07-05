<!DOCTYPE html><html lang="en" class="dark"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=block" rel="stylesheet"><link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&amp;display=swap" rel="stylesheet"><script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script><script id="tailwind-config">try{
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-background": "#dae2fd",
                        "surface-bright": "#31394d",
                        "primary": "#d0bcff",
                        "outline": "#958ea0",
                        "on-primary": "#3c0091",
                        "inverse-surface": "#dae2fd",
                        "surface-container": "#171f33",
                        "inverse-on-surface": "#283044",
                        "primary-fixed": "#e9ddff",
                        "on-secondary-fixed-variant": "#004395",
                        "surface-variant": "#2d3449",
                        "outline-variant": "#494454",
                        "on-primary-fixed": "#23005c",
                        "secondary-fixed": "#d8e2ff",
                        "on-secondary-container": "#e6ecff",
                        "on-primary-container": "#340080",
                        "secondary-fixed-dim": "#adc6ff",
                        "surface-tint": "#d0bcff",
                        "surface-container-lowest": "#060e20",
                        "inverse-primary": "#6d3bd7",
                        "surface-dim": "#0b1326",
                        "primary-container": "#a078ff",
                        "on-tertiary": "#003824",
                        "background": "#0b1326",
                        "on-surface-variant": "#cbc3d7",
                        "tertiary-fixed-dim": "#4edea3",
                        "on-tertiary-fixed": "#002113",
                        "on-secondary": "#002e6a",
                        "surface": "#0b1326",
                        "on-error-container": "#ffdad6",
                        "on-primary-fixed-variant": "#5516be",
                        "tertiary-fixed": "#6ffbbe",
                        "error-container": "#93000a",
                        "on-tertiary-fixed-variant": "#005236",
                        "on-secondary-fixed": "#001a42",
                        "on-tertiary-container": "#00311f",
                        "tertiary": "#4edea3",
                        "primary-fixed-dim": "#d0bcff",
                        "on-error": "#690005",
                        "tertiary-container": "#00a572",
                        "secondary": "#adc6ff",
                        "surface-container-highest": "#2d3449",
                        "error": "#ffb4ab",
                        "on-surface": "#dae2fd",
                        "surface-container-low": "#131b2e",
                        "surface-container-high": "#222a3d",
                        "secondary-container": "#0566d9"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "0.75rem"
                    },
                    "spacing": {
                        "xs": "4px",
                        "container-max": "1440px",
                        "md": "16px",
                        "gutter": "24px",
                        "base": "4px",
                        "sm": "8px",
                        "lg": "24px",
                        "xl": "32px",
                        "3xl": "64px",
                        "2xl": "48px"
                    },
                    "fontFamily": {
                        "headline-lg": ["Inter"],
                        "body-md": ["Inter"],
                        "display": ["Inter"],
                        "headline-md": ["Inter"],
                        "body-lg": ["Inter"],
                        "label-md": ["Inter"],
                        "title-lg": ["Inter"],
                        "code": ["JetBrains Mono"]
                    },
                    "fontSize": {
                        "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                        "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                        "display": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                        "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                        "body-lg": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                        "label-md": ["12px", {"lineHeight": "16px", "letterSpacing": "0.02em", "fontWeight": "500"}],
                        "title-lg": ["20px", {"lineHeight": "28px", "fontWeight": "500"}],
                        "code": ["13px", {"lineHeight": "18px", "fontWeight": "400"}]
                    }
                },
            },
        }
    }catch(_e){}</script><meta charset="utf-8"></head><body class="bg-background text-on-surface min-h-screen grid-bg">
<!-- TopNavBar (Shared Component) -->
<header class="fixed top-0 w-full bg-surface-container/70 backdrop-blur-xl border-b border-outline-variant/50 z-50 shadow-sm">
<nav class="flex justify-between items-center px-lg py-md max-w-container-max mx-auto h-16">
<div class="flex items-center gap-xl">
<a href="#" class="font-headline-md text-headline-md font-bold text-primary tracking-tight">Workspace Hub</a>
<div class="hidden md:flex items-center gap-lg">
<a href="#" class="text-primary font-bold border-b-2 border-primary pb-1 font-body-md text-body-md transition-colors duration-200">Documentation</a>
<a href="#" class="text-on-surface-variant font-medium font-body-md text-body-md hover:text-primary transition-colors duration-200">System Status</a>
<a href="#" class="text-on-surface-variant font-medium font-body-md text-body-md hover:text-primary transition-colors duration-200">Security</a>
</div>
</div>
<div class="flex items-center gap-md">
<button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-all p-2 rounded-full active:scale-95" data-icon="notifications" data-original-icon="notifications">notifications</button>
<button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-all p-2 rounded-full active:scale-95" data-icon="settings">settings</button>
<div class="h-8 w-[1px] bg-outline-variant/30 mx-2"></div>
<div class="flex items-center gap-sm cursor-pointer group">
<div class="w-8 h-8 rounded-full border border-primary overflow-hidden ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
<img class="w-full h-full object-cover" data-alt="A professional headshot of a senior software engineer in a high-tech DevOps environment. The lighting is moody with purple and blue rim lights, reflecting a modern cybersecurity aesthetic. The background is slightly blurred showing high-end server monitors with flowing data streams." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAt2qaCf-11C9SYNXlB1Cb3vIyNj8sa-1KNi53msIfZ7GGuPqBiPF5EmX0iw48e5cUDi5ywJVde6C9YU7TKMzZydIK1rlQaUX3TLHK_xwq9nX1c5O2h7kjk5VaPa48zuudEX39Fp6LPZYCw0wJ9zcHDDxNo_3y1dKRaaULpAAeHuovbO8C4GiaulfRwF6nMDiXo1DoDJBlOAVPFZYQtdhmXegECz9DD-MC7BRwDfz5a0KGLw4koLvpY11riAZnJDl0Bq78PqIiZu0c">
</div>
<span class="material-symbols-outlined text-on-surface-variant text-[18px]" data-icon="logout">logout</span>
</div>
</div>
</nav>
</header>
<main class="max-w-container-max mx-auto px-lg pt-[120px] pb-3xl">
<!-- Header Section -->
<div class="mb-xl">
<div class="flex items-center justify-between mb-xs"><h1 class="font-headline-lg text-headline-lg text-on-background">Your Workspaces</h1><button class="flex items-center gap-xs bg-primary text-on-primary px-md py-sm rounded-lg font-label-md uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"><span class="material-symbols-outlined text-[18px]">add</span>Create New</button></div>
<p class="font-body-md text-body-md text-on-surface-variant">Select a workspace to enter the automation dashboard.</p>
</div>
<!-- Dashboard Stats Row (High Density Context) -->
<div class="grid grid-cols-1 md:grid-cols-4 gap-md mb-xl">
<div class="bg-surface-container-low border border-outline-variant/20 p-md rounded-xl flex items-center gap-md">
<div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
<span class="material-symbols-outlined text-primary" data-icon="hub">hub</span>
</div>
<div>
<div class="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">Active Instances</div>
<div class="text-on-surface font-title-lg text-title-lg">14 Sites</div>
</div>
</div>
<div class="bg-surface-container-low border border-outline-variant/20 p-md rounded-xl flex items-center gap-md">
<div class="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center">
<span class="material-symbols-outlined text-tertiary" data-icon="check_circle">check_circle</span>
</div>
<div>
<div class="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">System Health</div>
<div class="text-on-surface font-title-lg text-title-lg">99.9%</div>
</div>
</div>
<div class="bg-surface-container-low border border-outline-variant/20 p-md rounded-xl flex items-center gap-md">
<div class="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
<span class="material-symbols-outlined text-secondary" data-icon="query_stats">query_stats</span>
</div>
<div>
<div class="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">Weekly Deployments</div>
<div class="text-on-surface font-title-lg text-title-lg">1,240</div>
</div>
</div>
<div class="bg-surface-container-low border border-outline-variant/20 p-md rounded-xl flex items-center gap-md">
<div class="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center">
<span class="material-symbols-outlined text-error" data-icon="emergency">emergency</span>
</div>
<div>
<div class="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">Open Incidents</div>
<div class="text-on-surface font-title-lg text-title-lg">0</div>
</div>
</div>
</div>
<!-- Workspace Grid -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-lg">
<!-- Workspace Card 1 -->
<div class="bg-surface-container-low border border-outline-variant/30 rounded-xl p-lg group hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden">
<div class="absolute top-0 right-0 p-md">
<div class="flex items-center gap-xs bg-tertiary/10 px-sm py-[2px] rounded-full border border-tertiary/30">
<span class="w-2 h-2 rounded-full bg-tertiary status-pulse"></span>
<span class="text-tertiary font-label-md text-label-md">Connected</span>
</div>
</div>
<div class="flex flex-col gap-lg">
<div class="w-14 h-14 rounded-2xl cyber-gradient flex items-center justify-center text-on-primary shadow-xl shadow-primary/20">
<span class="material-symbols-outlined text-[32px]" data-icon="forest">forest</span>
</div>
<div>
<h3 class="text-on-surface font-headline-md text-headline-md mb-xs">Đại Ngàn Automation</h3>
<div class="flex items-center gap-sm text-on-surface-variant">
<span class="material-symbols-outlined text-[16px]" data-icon="link">link</span>
<span class="font-code text-code">daingan.atlassian.net</span>
</div>
</div>
<div class="flex items-center justify-between border-t border-outline-variant/20 pt-md">
<div class="flex -space-x-2">
<div class="w-7 h-7 rounded-full border-2 border-surface-container-low bg-surface-variant flex items-center justify-center overflow-hidden">
<img class="w-full h-full object-cover" data-alt="Avatar of a team member, close up studio portrait, neon lighting environment." src="https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg">
</div>
<div class="w-7 h-7 rounded-full border-2 border-surface-container-low bg-surface-variant flex items-center justify-center overflow-hidden">
<img class="w-full h-full object-cover" data-alt="Avatar of a team member, professional lighting, technical office background." src="https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg">
</div>
<div class="w-7 h-7 rounded-full border-2 border-surface-container-low bg-surface-variant flex items-center justify-center text-label-md font-bold">+4</div>
</div>
<button class="text-primary font-bold text-label-md uppercase tracking-widest flex items-center gap-xs group-hover:gap-sm transition-all">
                            Enter Dashboard
                            <span class="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
</div>
</div>
<!-- Workspace Card 2 -->
<div class="bg-surface-container-low border border-outline-variant/30 rounded-xl p-lg group hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden">
<div class="absolute top-0 right-0 p-md">
<div class="flex items-center gap-xs bg-tertiary/10 px-sm py-[2px] rounded-full border border-tertiary/30">
<span class="w-2 h-2 rounded-full bg-tertiary status-pulse"></span>
<span class="text-tertiary font-label-md text-label-md">Connected</span>
</div>
</div>
<div class="flex flex-col gap-lg">
<div class="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-xl shadow-secondary/20">
<span class="material-symbols-outlined text-[32px]" data-icon="shopping_cart">shopping_cart</span>
</div>
<div>
<h3 class="text-on-surface font-headline-md text-headline-md mb-xs">E-Commerce QA</h3>
<div class="flex items-center gap-sm text-on-surface-variant">
<span class="material-symbols-outlined text-[16px]" data-icon="link">link</span>
<span class="font-code text-code">shop-flow.atlassian.net</span>
</div>
</div>
<div class="flex items-center justify-between border-t border-outline-variant/20 pt-md">
<div class="flex -space-x-2">
<div class="w-7 h-7 rounded-full border-2 border-surface-container-low bg-surface-variant flex items-center justify-center overflow-hidden">
<img class="w-full h-full object-cover" data-alt="Cyberpunk style profile picture of a woman with holographic glasses, vibrant color palette." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAuPwjh8dpKD4LWpTQZpKpERa1eEvz7qt1IougTLDXtuK5aXwNHTt1QOCVKXg0vBanlsvHZuUkIE675K4TgRyKw8GGte4_XKNzSWuAgdvEb0CPNkzfcWmCm5-Ts8fTE7KjWXPa4gh8oTyvDTAQmKRcuS4CtAqp8_FUWNHmcV7O0VItoYbEA4y9zF6KhEqNNZTv1yWD-_IYkOaGTpazoo3bIASQ_tjtD6AybSSK_YznNlDdmT-fgh81M8OhW35wq-5MGiJ0aR3ar0A">
</div>
<div class="w-7 h-7 rounded-full border-2 border-surface-container-low bg-surface-variant flex items-center justify-center text-label-md font-bold">+12</div>
</div>
<button class="text-primary font-bold text-label-md uppercase tracking-widest flex items-center gap-xs group-hover:gap-sm transition-all">
                            Enter Dashboard
                            <span class="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
</div>
</div>
<!-- Workspace Card 3 -->
<div class="bg-surface-container-low border border-outline-variant/30 rounded-xl p-lg group hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden">
<div class="absolute top-0 right-0 p-md">
<div class="flex items-center gap-xs bg-tertiary/10 px-sm py-[2px] rounded-full border border-tertiary/30">
<span class="w-2 h-2 rounded-full bg-tertiary status-pulse"></span>
<span class="text-tertiary font-label-md text-label-md">Connected</span>
</div>
</div>
<div class="flex flex-col gap-lg">
<div class="w-14 h-14 rounded-2xl bg-surface-variant flex items-center justify-center text-primary shadow-xl shadow-black/20 border border-primary/20">
<span class="material-symbols-outlined text-[32px]" data-icon="payments">payments</span>
</div>
<div>
<h3 class="text-on-surface font-headline-md text-headline-md mb-xs">FinTech Solutions</h3>
<div class="flex items-center gap-sm text-on-surface-variant">
<span class="material-symbols-outlined text-[16px]" data-icon="link">link</span>
<span class="font-code text-code">fin-secure.atlassian.net</span>
</div>
</div>
<div class="flex items-center justify-between border-t border-outline-variant/20 pt-md">
<div class="flex -space-x-2">
<div class="w-7 h-7 rounded-full border-2 border-surface-container-low bg-surface-variant flex items-center justify-center overflow-hidden">
<img class="w-full h-full object-cover" data-alt="Portrait of a professional fintech analyst in a dark suit with a futuristic heads-up display reflecting in the background glass. Modern, sleek, and high-trust aesthetic." src="https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg">
</div>
<div class="w-7 h-7 rounded-full border-2 border-surface-container-low bg-surface-variant flex items-center justify-center text-label-md font-bold">+8</div>
</div>
<button class="text-primary font-bold text-label-md uppercase tracking-widest flex items-center gap-xs group-hover:gap-sm transition-all">
                            Enter Dashboard
                            <span class="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
</div>
</div>
<!-- Create New Card -->
<div class="border-2 border-dashed border-outline-variant bg-transparent rounded-xl p-lg flex flex-col items-center justify-center gap-md group hover:border-solid hover:border-primary hover:bg-surface-container-high transition-all duration-300 cursor-pointer min-h-[280px]">
<div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined text-[40px] text-primary" data-icon="add">add</span>
</div>
<div class="text-center">
<span class="block text-on-surface font-headline-md text-headline-md">Connect New Jira Site</span>
<span class="block text-on-surface-variant font-body-md text-body-md mt-xs">Add an Enterprise workspace to your hub</span>
</div>
</div>
</div>
<!-- System Message / Logs (Density) -->
<div class="mt-2xl bg-surface-container-lowest border border-outline-variant/10 rounded-xl overflow-hidden shadow-inner">
<div class="bg-surface-container px-md py-sm border-b border-outline-variant/20 flex items-center justify-between">
<div class="flex items-center gap-sm">
<span class="material-symbols-outlined text-on-surface-variant text-[16px]" data-icon="terminal">terminal</span>
<span class="font-code text-label-md text-on-surface-variant uppercase tracking-widest">Global Event Stream</span>
</div>
<div class="flex gap-xs">
<span class="w-2 h-2 rounded-full bg-error/40"></span>
<span class="w-2 h-2 rounded-full bg-secondary/40"></span>
<span class="w-2 h-2 rounded-full bg-tertiary/40"></span>
</div>
</div>
<div class="p-md font-code text-code text-on-surface-variant/80 space-y-1">
<div class="">[<span class="text-primary">14:02:45</span>] <span class="text-tertiary">SUCCESS:</span> Authenticated session for user_dev_09</div>
<div class="">[<span class="text-primary">14:02:58</span>] <span class="text-on-surface">INFO:</span> Fetched 3 active workspaces for "Global Hub"</div>
<div class="">[<span class="text-primary">14:03:12</span>] <span class="text-secondary">SYSTEM:</span> Synchronizing Jira APIs with "FinTech Solutions"...</div>
<div class="animate-pulse">[<span class="text-primary">14:04:00</span>] <span class="text-on-surface-variant">LISTENING:</span> Waiting for telemetry packets... <span class="bg-on-surface-variant/20 px-xs rounded">_</span></div>
</div>
</div>
</main>
<!-- Side Navigation Placeholder logic (Not used as this is a top-level hub) -->
<script class="">
        // Micro-interactions for workspace cards
        document.querySelectorAll('.group').forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Potential JS driven sound effects or specific animations
            });
        });
    </script>

</body></html>