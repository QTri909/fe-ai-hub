<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Projects | JiraAutoTest</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-tertiary-fixed": "#002113",
                    "primary-container": "#a078ff",
                    "surface-dim": "#0b1326",
                    "surface-container-lowest": "#060e20",
                    "on-background": "#dae2fd",
                    "secondary-container": "#0566d9",
                    "surface-container-highest": "#2d3449",
                    "surface-variant": "#2d3449",
                    "tertiary-container": "#00a572",
                    "surface-tint": "#d0bcff",
                    "on-secondary-fixed-variant": "#004395",
                    "surface-bright": "#31394d",
                    "on-primary-fixed-variant": "#5516be",
                    "tertiary-fixed-dim": "#4edea3",
                    "on-secondary-fixed": "#001a42",
                    "on-error-container": "#ffdad6",
                    "inverse-on-surface": "#283044",
                    "on-tertiary-fixed-variant": "#005236",
                    "on-secondary": "#002e6a",
                    "error-container": "#93000a",
                    "primary": "#d0bcff",
                    "on-error": "#690005",
                    "secondary-fixed-dim": "#adc6ff",
                    "inverse-primary": "#6d3bd7",
                    "surface-container-high": "#222a3d",
                    "background": "#0b1326",
                    "surface-container": "#171f33",
                    "secondary-fixed": "#d8e2ff",
                    "on-primary-container": "#340080",
                    "secondary": "#adc6ff",
                    "primary-fixed-dim": "#d0bcff",
                    "on-primary": "#3c0091",
                    "outline-variant": "#494454",
                    "on-tertiary-container": "#00311f",
                    "surface-container-low": "#131b2e",
                    "primary-fixed": "#e9ddff",
                    "surface": "#0b1326",
                    "tertiary-fixed": "#6ffbbe",
                    "on-tertiary": "#003824",
                    "error": "#ffb4ab",
                    "on-primary-fixed": "#23005c",
                    "outline": "#958ea0",
                    "inverse-surface": "#dae2fd",
                    "on-surface": "#dae2fd",
                    "on-secondary-container": "#e6ecff",
                    "on-surface-variant": "#cbc3d7",
                    "tertiary": "#4edea3"
            },
            "borderRadius": {
                    "DEFAULT": "0.125rem",
                    "lg": "0.25rem",
                    "xl": "0.5rem",
                    "full": "0.75rem"
            },
            "spacing": {
                    "container-max": "1440px",
                    "sm": "8px",
                    "md": "16px",
                    "gutter": "24px",
                    "2xl": "48px",
                    "xl": "32px",
                    "xs": "4px",
                    "lg": "24px",
                    "base": "4px",
                    "3xl": "64px"
            },
            "fontFamily": {
                    "body-md": ["Geist"],
                    "title-lg": ["Geist"],
                    "body-lg": ["Geist"],
                    "label-md": ["Geist"],
                    "code": ["JetBrains Mono"],
                    "headline-lg": ["Geist"],
                    "headline-md": ["Geist"]
            },
            "fontSize": {
                    "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                    "title-lg": ["20px", {"lineHeight": "28px", "fontWeight": "500"}],
                    "body-lg": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                    "label-md": ["12px", {"lineHeight": "16px", "letterSpacing": "0.02em", "fontWeight": "500"}],
                    "code": ["13px", {"lineHeight": "18px", "fontWeight": "400"}],
                    "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                    "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600"}]
            }
          }
        }
      }
    </script>
<style>
      body {
        background-color: #0b1326;
        font-family: 'Geist', sans-serif;
        color: #dae2fd;
        -webkit-font-smoothing: antialiased;
      }
      .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      }
      .cyber-gradient {
        background: linear-gradient(135deg, #a078ff 0%, #6d3bd7 100%);
      }
      .card-glow:hover {
        box-shadow: 0 0 15px rgba(208, 188, 255, 0.1);
        border-color: #d0bcff;
        transform: translateY(-2px);
      }
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #2d3449;
        border-radius: 10px;
      }
      .glass-blur {
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
    </style>
</head>
<body class="overflow-hidden">
<!-- TopNavBar -->
<header class="fixed top-0 w-full z-50 bg-surface-container/70 backdrop-blur-xl border-b border-surface-variant/50 shadow-sm flex justify-between items-center h-16 px-gutter w-full">
<div class="flex items-center gap-md">
<span class="font-headline-md text-headline-md font-bold text-primary">JiraAutoTest</span>
<div class="hidden md:flex ml-xl gap-lg">
<nav class="flex gap-md">
<a class="font-body-md text-body-md text-on-surface-variant hover:bg-surface-bright/50 transition-colors px-3 py-1 rounded" href="#">Dashboard</a>
<a class="font-body-md text-body-md text-primary font-bold border-b-2 border-primary px-3 py-1" href="#">Projects</a>
<a class="font-body-md text-body-md text-on-surface-variant hover:bg-surface-bright/50 transition-colors px-3 py-1 rounded" href="#">Automation</a>
</nav>
</div>
</div>
<div class="flex items-center gap-md">
<button class="flex items-center gap-xs px-sm py-xs text-on-surface-variant hover:bg-surface-bright/50 transition-colors rounded">
<span class="material-symbols-outlined text-[18px]">help_outline</span>
<span class="font-label-md text-label-md">Support</span>
</button>
<button class="flex items-center gap-xs px-sm py-xs text-on-surface-variant hover:bg-surface-bright/50 transition-colors rounded">
<span class="material-symbols-outlined text-[18px]">notifications</span>
</button>
<div class="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30">
<img alt="User profile" data-alt="Close up profile portrait of a professional software engineer with a focused expression, set against a dark, tech-oriented office background with soft bokeh lights. The lighting is low-key with cool blue and purple highlights, matching a dark-mode UI aesthetic. High detail, sharp focus, cinematic professional photography style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzWHQVJIoQRZR50nl1o-eVSRgekBhzFrSWqysoh245yjnEO88_6ydm7uuBzEMkDemjA5PiyafGXeBBBahwG1lSJ4XyRX1iHIGJmfuTxWRCR3gcsRJm8iGjHEajVbRuTfYVhKYQ3YXhgXki71AdoJKG42MFkENt40DD2pnYree3JgZ93u_hdF9f0a7UvZ92lIVlGQ--eUkA6rOK8657EW-9eCZpfPPmFdLsMciQ4w0hN0H1CkXrPxKETKMYd7vhZpmLQz6ohDBZ3ec"/>
</div>
</div>
</header>
<div class="flex h-screen pt-16">
<!-- SideNavBar -->
<aside class="hidden md:flex flex-col h-full w-64 bg-surface-container-low border-r border-surface-variant/50 py-lg shrink-0">
<div class="px-md mb-xl flex items-center gap-sm">
<div class="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
<span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">smart_toy</span>
</div>
<div>
<h2 class="font-label-md text-label-md font-black text-primary leading-tight">JiraAutoTest</h2>
<p class="text-[10px] text-on-surface-variant uppercase tracking-widest">Enterprise Automation</p>
</div>
</div>
<nav class="flex-1 flex flex-col gap-xs px-sm">
<a class="flex items-center gap-md px-md py-sm rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-highest/50 transition-all active:translate-x-1 duration-150" href="#">
<span class="material-symbols-outlined">dashboard</span>
<span class="font-label-md text-label-md">Overview</span>
</a>
<a class="flex items-center gap-md px-md py-sm rounded text-primary bg-primary-container/10 border-r-2 border-primary active:translate-x-1 duration-150" href="#">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">folder_copy</span>
<span class="font-label-md text-label-md">Projects</span>
</a>
<a class="flex items-center gap-md px-md py-sm rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-highest/50 transition-all active:translate-x-1 duration-150" href="#">
<span class="material-symbols-outlined">playlist_add_check</span>
<span class="font-label-md text-label-md">Test Suites</span>
</a>
<a class="flex items-center gap-md px-md py-sm rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-highest/50 transition-all active:translate-x-1 duration-150" href="#">
<span class="material-symbols-outlined">smart_toy</span>
<span class="font-label-md text-label-md">AI Agents</span>
</a>
<a class="flex items-center gap-md px-md py-sm rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-highest/50 transition-all active:translate-x-1 duration-150" href="#">
<span class="material-symbols-outlined">settings</span>
<span class="font-label-md text-label-md">Settings</span>
</a>
</nav>
<div class="px-sm mt-auto flex flex-col gap-xs border-t border-surface-variant/30 pt-lg">
<div class="px-md mb-md">
<button class="w-full cyber-gradient text-white font-label-md text-label-md py-2 rounded-lg shadow-lg shadow-primary/20 active:scale-95 transition-transform">
                        Upgrade Plan
                    </button>
</div>
<a class="flex items-center gap-md px-md py-sm rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-highest/50 transition-all" href="#">
<span class="material-symbols-outlined">help</span>
<span class="font-label-md text-label-md">Help</span>
</a>
<a class="flex items-center gap-md px-md py-sm rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-highest/50 transition-all" href="#">
<span class="material-symbols-outlined">logout</span>
<span class="font-label-md text-label-md">Logout</span>
</a>
</div>
</aside>
<!-- Main Content Canvas -->
<main class="flex-1 overflow-y-auto custom-scrollbar bg-background">
<div class="max-w-[1200px] mx-auto px-gutter py-xl">
<!-- Header & Action Bar -->
<div class="flex flex-col md:flex-row md:items-center justify-between gap-lg mb-xl">
<div>
<h1 class="text-xl font-bold font-headline-md text-on-surface">Projects</h1>
<p class="text-xs text-on-surface-variant font-body-md">Manage testing projects and Jira synchronization.</p>
</div>
<div class="flex items-center gap-md flex-wrap">
<!-- Search -->
<div class="relative group">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] group-focus-within:text-primary transition-colors">search</span>
<input class="bg-surface-container-high border-none rounded-md pl-10 pr-4 py-2 text-sm text-on-surface w-64 focus:ring-2 focus:ring-primary/50 transition-all" placeholder="Search projects..." type="text"/>
</div>
<!-- Filter -->
<button class="flex items-center gap-xs px-md py-2 rounded-md bg-surface-container-highest/30 border border-outline-variant/50 hover:bg-surface-container-highest/50 transition-colors text-sm font-medium">
<span class="material-symbols-outlined text-[18px]">filter_list</span>
<span>Filter View</span>
</button>
<!-- New Project -->
<button class="flex items-center gap-xs px-lg py-2 rounded-md bg-tertiary-container text-on-tertiary-container font-semibold text-sm hover:brightness-110 active:scale-95 transition-all shadow-sm">
<span class="material-symbols-outlined text-[18px]">add</span>
<span>New Project</span>
</button>
</div>
</div>
<!-- View Toggle & Sort (Sub-header) -->
<div class="flex justify-between items-center mb-lg">
<div class="flex items-center gap-md">
<span class="text-xs font-label-md text-on-surface-variant uppercase tracking-wider">Active Workspace (6)</span>
</div>
<div class="bg-surface-container-high p-1 rounded-lg flex items-center gap-1 border border-outline-variant/30">
<button class="p-1.5 rounded-md bg-surface-bright text-primary shadow-sm" id="gridViewToggle">
<span class="material-symbols-outlined text-[20px]">grid_view</span>
</button>
<button class="p-1.5 rounded-md text-on-surface-variant hover:bg-surface-bright/50 transition-colors" id="listViewToggle">
<span class="material-symbols-outlined text-[20px]">format_list_bulleted</span>
</button>
</div>
</div>
<!-- Projects Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
<!-- Card 1 -->
<div class="bg-surface-container-low rounded-lg border border-outline-variant/50 p-lg transition-all duration-300 card-glow group">
<div class="flex items-center justify-between mb-lg">
<div class="flex items-center gap-md">
<div class="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined">shopping_cart</span>
</div>
<div>
<h3 class="font-title-lg text-body-lg font-bold text-on-surface">E-Commerce App</h3>
<code class="font-code text-[11px] bg-surface-container-highest/50 px-1.5 py-0.5 rounded text-outline uppercase">KEY: ECO</code>
</div>
</div>
<button class="text-on-surface-variant hover:bg-surface-bright/50 p-1 rounded-full transition-colors">
<span class="material-symbols-outlined">more_vert</span>
</button>
</div>
<div class="grid grid-cols-3 gap-md mb-xl">
<div>
<p class="text-[11px] text-on-surface-variant font-label-md uppercase mb-xs">Total Issues</p>
<p class="font-bold text-body-lg text-on-surface">128</p>
</div>
<div>
<p class="text-[11px] text-on-surface-variant font-label-md uppercase mb-xs">Suites</p>
<p class="font-bold text-body-lg text-on-surface">45</p>
</div>
<div>
<p class="text-[11px] text-on-surface-variant font-label-md uppercase mb-xs">Pass Rate</p>
<p class="font-bold text-body-lg text-tertiary">94%</p>
</div>
</div>
<div class="flex items-center justify-between pt-md border-t border-outline-variant/20">
<div class="flex items-center gap-xs">
<span class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
<span class="text-[12px] text-on-surface-variant">Synced 5m ago</span>
</div>
<button class="text-xs font-bold text-primary hover:underline transition-all">View Details</button>
</div>
</div>
<!-- Card 2 -->
<div class="bg-surface-container-low rounded-lg border border-outline-variant/50 p-lg transition-all duration-300 card-glow group">
<div class="flex items-center justify-between mb-lg">
<div class="flex items-center gap-md">
<div class="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined">account_balance</span>
</div>
<div>
<h3 class="font-title-lg text-body-lg font-bold text-on-surface">FinTech API</h3>
<code class="font-code text-[11px] bg-surface-container-highest/50 px-1.5 py-0.5 rounded text-outline uppercase">KEY: FIN</code>
</div>
</div>
<button class="text-on-surface-variant hover:bg-surface-bright/50 p-1 rounded-full transition-colors">
<span class="material-symbols-outlined">more_vert</span>
</button>
</div>
<div class="grid grid-cols-3 gap-md mb-xl">
<div>
<p class="text-[11px] text-on-surface-variant font-label-md uppercase mb-xs">Total Issues</p>
<p class="font-bold text-body-lg text-on-surface">312</p>
</div>
<div>
<p class="text-[11px] text-on-surface-variant font-label-md uppercase mb-xs">Suites</p>
<p class="font-bold text-body-lg text-on-surface">104</p>
</div>
<div>
<p class="text-[11px] text-on-surface-variant font-label-md uppercase mb-xs">Pass Rate</p>
<p class="font-bold text-body-lg text-tertiary">98.2%</p>
</div>
</div>
<div class="flex items-center justify-between pt-md border-t border-outline-variant/20">
<div class="flex items-center gap-xs">
<span class="w-2 h-2 rounded-full bg-tertiary"></span>
<span class="text-[12px] text-on-surface-variant">Synced 12m ago</span>
</div>
<button class="text-xs font-bold text-primary hover:underline transition-all">View Details</button>
</div>
</div>
<!-- Card 3 -->
<div class="bg-surface-container-low rounded-lg border border-outline-variant/50 p-lg transition-all duration-300 card-glow group">
<div class="flex items-center justify-between mb-lg">
<div class="flex items-center gap-md">
<div class="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined">inventory_2</span>
</div>
<div>
<h3 class="font-title-lg text-body-lg font-bold text-on-surface">WMS Mobile</h3>
<code class="font-code text-[11px] bg-surface-container-highest/50 px-1.5 py-0.5 rounded text-outline uppercase">KEY: WMS</code>
</div>
</div>
<button class="text-on-surface-variant hover:bg-surface-bright/50 p-1 rounded-full transition-colors">
<span class="material-symbols-outlined">more_vert</span>
</button>
</div>
<div class="grid grid-cols-3 gap-md mb-xl">
<div>
<p class="text-[11px] text-on-surface-variant font-label-md uppercase mb-xs">Total Issues</p>
<p class="font-bold text-body-lg text-on-surface">56</p>
</div>
<div>
<p class="text-[11px] text-on-surface-variant font-label-md uppercase mb-xs">Suites</p>
<p class="font-bold text-body-lg text-on-surface">12</p>
</div>
<div>
<p class="text-[11px] text-on-surface-variant font-label-md uppercase mb-xs">Pass Rate</p>
<p class="font-bold text-body-lg text-error">72%</p>
</div>
</div>
<div class="flex items-center justify-between pt-md border-t border-outline-variant/20">
<div class="flex items-center gap-xs">
<span class="w-2 h-2 rounded-full bg-error"></span>
<span class="text-[12px] text-on-surface-variant">Syncing failed 1h ago</span>
</div>
<button class="text-xs font-bold text-primary hover:underline transition-all">View Details</button>
</div>
</div>
<!-- Additional Grid Items for Density -->
<!-- Card 4 -->
<div class="bg-surface-container-low rounded-lg border border-outline-variant/50 p-lg transition-all duration-300 card-glow group">
<div class="flex items-center justify-between mb-lg">
<div class="flex items-center gap-md">
<div class="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined">support_agent</span>
</div>
<div>
<h3 class="font-title-lg text-body-lg font-bold text-on-surface">CRM Portal</h3>
<code class="font-code text-[11px] bg-surface-container-highest/50 px-1.5 py-0.5 rounded text-outline uppercase">KEY: CRM</code>
</div>
</div>
<button class="text-on-surface-variant hover:bg-surface-bright/50 p-1 rounded-full transition-colors">
<span class="material-symbols-outlined">more_vert</span>
</button>
</div>
<div class="grid grid-cols-3 gap-md mb-xl">
<div>
<p class="text-[11px] text-on-surface-variant font-label-md uppercase mb-xs">Total Issues</p>
<p class="font-bold text-body-lg text-on-surface">204</p>
</div>
<div>
<p class="text-[11px] text-on-surface-variant font-label-md uppercase mb-xs">Suites</p>
<p class="font-bold text-body-lg text-on-surface">88</p>
</div>
<div>
<p class="text-[11px] text-on-surface-variant font-label-md uppercase mb-xs">Pass Rate</p>
<p class="font-bold text-body-lg text-tertiary">91%</p>
</div>
</div>
<div class="flex items-center justify-between pt-md border-t border-outline-variant/20">
<div class="flex items-center gap-xs">
<span class="w-2 h-2 rounded-full bg-tertiary"></span>
<span class="text-[12px] text-on-surface-variant">Synced 2h ago</span>
</div>
<button class="text-xs font-bold text-primary hover:underline transition-all">View Details</button>
</div>
</div>
<!-- Card 5 -->
<div class="bg-surface-container-low rounded-lg border border-outline-variant/50 p-lg transition-all duration-300 card-glow group">
<div class="flex items-center justify-between mb-lg">
<div class="flex items-center gap-md">
<div class="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined">biotech</span>
</div>
<div>
<h3 class="font-title-lg text-body-lg font-bold text-on-surface">Research Lab</h3>
<code class="font-code text-[11px] bg-surface-container-highest/50 px-1.5 py-0.5 rounded text-outline uppercase">KEY: LAB</code>
</div>
</div>
<button class="text-on-surface-variant hover:bg-surface-bright/50 p-1 rounded-full transition-colors">
<span class="material-symbols-outlined">more_vert</span>
</button>
</div>
<div class="grid grid-cols-3 gap-md mb-xl">
<div>
<p class="text-[11px] text-on-surface-variant font-label-md uppercase mb-xs">Total Issues</p>
<p class="font-bold text-body-lg text-on-surface">42</p>
</div>
<div>
<p class="text-[11px] text-on-surface-variant font-label-md uppercase mb-xs">Suites</p>
<p class="font-bold text-body-lg text-on-surface">15</p>
</div>
<div>
<p class="text-[11px] text-on-surface-variant font-label-md uppercase mb-xs">Pass Rate</p>
<p class="font-bold text-body-lg text-on-surface">N/A</p>
</div>
</div>
<div class="flex items-center justify-between pt-md border-t border-outline-variant/20">
<div class="flex items-center gap-xs">
<span class="w-2 h-2 rounded-full bg-outline"></span>
<span class="text-[12px] text-on-surface-variant">Never synced</span>
</div>
<button class="text-xs font-bold text-primary hover:underline transition-all">View Details</button>
</div>
</div>
<!-- Card 6 -->
<div class="bg-surface-container-low rounded-lg border border-outline-variant/50 p-lg transition-all duration-300 card-glow group">
<div class="flex items-center justify-between mb-lg">
<div class="flex items-center gap-md">
<div class="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined">rocket_launch</span>
</div>
<div>
<h3 class="font-title-lg text-body-lg font-bold text-on-surface">SpaceOps v2</h3>
<code class="font-code text-[11px] bg-surface-container-highest/50 px-1.5 py-0.5 rounded text-outline uppercase">KEY: SO2</code>
</div>
</div>
<button class="text-on-surface-variant hover:bg-surface-bright/50 p-1 rounded-full transition-colors">
<span class="material-symbols-outlined">more_vert</span>
</button>
</div>
<div class="grid grid-cols-3 gap-md mb-xl">
<div>
<p class="text-[11px] text-on-surface-variant font-label-md uppercase mb-xs">Total Issues</p>
<p class="font-bold text-body-lg text-on-surface">884</p>
</div>
<div>
<p class="text-[11px] text-on-surface-variant font-label-md uppercase mb-xs">Suites</p>
<p class="font-bold text-body-lg text-on-surface">422</p>
</div>
<div>
<p class="text-[11px] text-on-surface-variant font-label-md uppercase mb-xs">Pass Rate</p>
<p class="font-bold text-body-lg text-tertiary">99.9%</p>
</div>
</div>
<div class="flex items-center justify-between pt-md border-t border-outline-variant/20">
<div class="flex items-center gap-xs">
<span class="w-2 h-2 rounded-full bg-tertiary"></span>
<span class="text-[12px] text-on-surface-variant">Synced 1m ago</span>
</div>
<button class="text-xs font-bold text-primary hover:underline transition-all">View Details</button>
</div>
</div>
</div>
<!-- Empty State (Hidden) -->
<div class="hidden flex-col items-center justify-center py-2xl text-center" id="emptyState">
<div class="w-24 h-24 bg-surface-container-highest/20 rounded-full flex items-center justify-center mb-lg">
<span class="material-symbols-outlined text-outline text-[48px] opacity-40">folder_open</span>
</div>
<h2 class="text-title-lg font-bold text-on-surface mb-sm">No projects found</h2>
<p class="text-body-md text-on-surface-variant mb-xl max-w-xs">Start by connecting your Jira workspace or manually create a testing project.</p>
<button class="px-xl py-3 rounded-md bg-primary text-on-primary font-bold hover:brightness-110 transition-all flex items-center gap-md">
<span class="material-symbols-outlined">sync</span>
                        Import Project from Jira
                    </button>
</div>
<!-- Footer / Status Info -->
<div class="mt-2xl flex items-center justify-between text-[11px] text-outline font-label-md uppercase tracking-widest border-t border-surface-variant/30 pt-lg">
<div class="flex items-center gap-lg">
<span>Showing 6 of 6 projects</span>
<span class="text-on-surface-variant">•</span>
<span>Region: US-East-1 (Production)</span>
</div>
<div class="flex items-center gap-md">
<span class="flex items-center gap-xs"><span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span> System Health: Nominal</span>
</div>
</div>
</div>
</main>
</div>
<!-- Floating Action Button for Mobile -->
<button class="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full cyber-gradient text-white shadow-2xl flex items-center justify-center active:scale-90 transition-transform">
<span class="material-symbols-outlined text-[28px]">add</span>
</button>
<script>
        // Simple Interaction Logic
        const gridBtn = document.getElementById('gridViewToggle');
        const listBtn = document.getElementById('listViewToggle');
        
        gridBtn.addEventListener('click', () => {
            gridBtn.classList.add('bg-surface-bright', 'text-primary');
            gridBtn.classList.remove('text-on-surface-variant');
            listBtn.classList.remove('bg-surface-bright', 'text-primary');
            listBtn.classList.add('text-on-surface-variant');
        });

        listBtn.addEventListener('click', () => {
            listBtn.classList.add('bg-surface-bright', 'text-primary');
            listBtn.classList.remove('text-on-surface-variant');
            gridBtn.classList.remove('bg-surface-bright', 'text-primary');
            gridBtn.classList.add('text-on-surface-variant');
        });

        // Add subtle animation delay to cards
        document.querySelectorAll('.card-glow').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
                card.style.transition = 'all 0.4s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    </script>
</body></html>