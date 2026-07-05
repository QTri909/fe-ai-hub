<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>JiraAutoTest | Workspace Dashboard</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&amp;family=JetBrains+Mono:wght@100..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
        :root {
            --primary-glow: rgba(208, 188, 255, 0.15);
            --cyber-purple: #d0bcff;
        }
        body {
            background-color: #0b1326;
            color: #dae2fd;
            font-family: 'Geist', sans-serif;
        }
        .cyber-border-glow:hover {
            border-color: var(--cyber-purple);
            box-shadow: 0 0 15px var(--primary-glow);
            transform: translateY(-2px);
        }
        .glass-panel {
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }
        .skeleton {
            background: linear-gradient(90deg, #1e293b 25%, #2d3449 50%, #1e293b 75%);
            background-size: 200% 100%;
            animation: skeleton-loading 1.5s infinite;
        }
        @keyframes skeleton-loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
    </style>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "on-tertiary-container": "#00311f",
                      "on-primary-fixed-variant": "#5516be",
                      "on-secondary-fixed": "#001a42",
                      "on-secondary-container": "#e6ecff",
                      "on-primary-fixed": "#23005c",
                      "tertiary-fixed-dim": "#4edea3",
                      "surface-container-highest": "#2d3449",
                      "surface": "#0b1326",
                      "on-surface-variant": "#cbc3d7",
                      "on-primary-container": "#340080",
                      "inverse-on-surface": "#283044",
                      "secondary-container": "#0566d9",
                      "outline-variant": "#494454",
                      "background": "#0b1326",
                      "tertiary-container": "#00a572",
                      "surface-variant": "#2d3449",
                      "on-error-container": "#ffdad6",
                      "on-tertiary": "#003824",
                      "surface-tint": "#d0bcff",
                      "surface": "#0b1326",
                      "on-surface-variant": "#cbc3d7",
                      "secondary": "#adc6ff",
                      "surface-container-lowest": "#060e20",
                      "surface-container-high": "#222a3d",
                      "primary": "#d0bcff",
                      "tertiary": "#4edea3",
                      "on-surface": "#dae2fd",
                      "outline": "#958ea0",
                      "primary-container": "#a078ff"
              },
              "borderRadius": {
                      "DEFAULT": "2px",
                      "lg": "4px",
                      "xl": "8px",
                      "full": "12px"
              },
              "spacing": {
                      "3xl": "64px",
                      "xs": "4px",
                      "2xl": "48px",
                      "md": "16px",
                      "lg": "24px",
                      "sm": "8px",
                      "gutter": "24px",
                      "container-max": "1440px",
                      "base": "4px",
                      "xl": "32px"
              },
              "fontFamily": {
                      "code": ["JetBrains Mono"],
                      "headline-md": ["Geist"],
                      "body-md": ["Geist"],
                      "label-md": ["Geist"]
              },
              "fontSize": {
                      "code": ["13px", {"lineHeight": "18px", "fontWeight": "400"}],
                      "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                      "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                      "label-md": ["12px", {"lineHeight": "16px", "letterSpacing": "0.02em", "fontWeight": "500"}]
              }
            },
          }
        }
    </script>
</head>
<body class="flex overflow-hidden">
<!-- SideNavBar -->
<aside class="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col py-4 px-4 z-50">
<!-- Workspace Selector -->
<div class="px-2 mb-4"><div class="flex items-center justify-between p-2 bg-surface-container-high rounded-xl border border-outline-variant/20 hover:bg-surface-bright transition-all cursor-pointer group">
<div class="flex items-center gap-3 overflow-hidden">
<div class="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
<img class="w-full h-full object-cover" data-alt="A minimalist logo for a coffee tech brand named Dai Ngan Coffee, featuring a stylized mountain silhouette integrated with a coffee bean shape. The aesthetic is clean, professional, and tech-oriented, using a palette of deep slate and vibrant purple accents on a dark background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdzGLJ0OfLNEylOJDudA6QG8FOYfl1hPs6tzqbrtSSH9d6u60f9Tx8xHX1OVSyGt9EhkhUBNZ2fz5b_fqc6DWuYgDVdEFwcaHkbWA44uYMdBJ0qQITHrvaIpS0tNF1MY_WXXiQ6kg78yteMskw27gDfNkehmAjGDM4ArGfE-VHEPkxgHHB_UzZSHN-ESrdrykf1Hi7ZGh7PLLX9UowE37hEKrakN000PFjj-k86_yEj-k9f1LvMkSDUNTOJjnV2EFiCqNjJLnE7EQ"/>
</div>
<div class="overflow-hidden">
<h2 class="font-headline-md text-sm font-bold text-primary truncate">Đại Ngàn Coffee</h2>
<p class="font-label-md text-[10px] text-on-surface-variant/70 truncate">daingan.atlassian.net</p>
</div>
</div>
<span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-sm">unfold_more</span>
</div></div>
<nav class="flex-1 space-y-1">
<a class="flex items-center gap-3 px-4 py-2 text-primary font-bold border-r-2 border-primary bg-primary/5 transition-colors duration-200" href="#">
<span class="material-symbols-outlined text-sm">dashboard</span>
<span class="font-label-md text-xs">Overview</span>
</a>
<a class="flex items-center gap-3 px-4 py-2 text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors duration-200" href="#">
<span class="material-symbols-outlined text-sm">account_tree</span>
<span class="font-label-md text-xs">Projects</span>
</a>
<a class="flex items-center gap-3 px-4 py-2 text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors duration-200" href="#">
<span class="material-symbols-outlined text-sm">biotech</span>
<span class="font-label-md text-xs">Test Suites</span>
</a>
<a class="flex items-center gap-3 px-4 py-2 text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors duration-200" href="#">
<span class="material-symbols-outlined text-sm">smart_toy</span>
<span class="font-label-md text-xs">AI Agents</span>
</a>
<a class="flex items-center gap-3 px-4 py-2 text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors duration-200 mt-auto" href="#">
<span class="material-symbols-outlined text-sm">settings</span>
<span class="font-label-md text-xs">Settings</span>
</a>
</nav>
<div class="mt-4 pt-4 border-t border-outline-variant/20 px-2 mb-2">
<div class="flex items-center gap-2">
<div class="p-1 bg-tertiary/10 rounded">
<span class="material-symbols-outlined text-tertiary text-xs" style="font-variation-settings: 'FILL' 1;">terminal</span>
</div>
<span class="font-code text-[10px] text-on-surface-variant">v2.4.0-stable</span>
</div>
</div>
</aside>
<!-- Main Wrapper -->
<div class="ml-64 flex-1 flex flex-col h-screen overflow-hidden">
<!-- TopAppBar -->
<header class="h-14 flex justify-between items-center px-4 bg-surface/70 backdrop-blur-xl border-b border-outline-variant/30 sticky top-0 z-40">
<div class="flex items-center gap-4 w-1/2">
<div class="relative w-full max-w-md">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
<input class="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-1.5 pl-9 pr-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all placeholder:text-on-surface-variant/50" placeholder="Search Jira issues or tests..." type="text"/>
</div>
</div>
<div class="flex items-center gap-4">
<div class="flex items-center gap-2 px-3 py-1 bg-tertiary/10 border border-tertiary/20 rounded-full">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
<span class="text-[10px] font-bold text-tertiary uppercase tracking-wider">Jira Sync: Active</span>
</div>
<div class="flex items-center gap-3 border-l border-outline-variant/30 pl-4">
<button class="p-1.5 hover:bg-surface-container-high/50 rounded-full text-on-surface-variant transition-colors">
<span class="material-symbols-outlined text-sm">sync</span>
</button>
<button class="p-1.5 hover:bg-surface-container-high/50 rounded-full text-on-surface-variant transition-colors relative">
<span class="material-symbols-outlined text-sm">notifications</span>
<span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-error rounded-full"></span>
</button>
<div class="w-7 h-7 rounded-full overflow-hidden border border-primary/20">
<img class="w-full h-full object-cover" data-alt="A close-up portrait of a senior software engineer in a high-tech office environment. The individual has a focused, professional expression. Behind them, subtle bokeh lights from server racks and monitors illuminate the scene in a palette of deep blues and cyber-purples. Professional LinkedIn style portrait." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgH0krT49JvFm1jJv7Rv-y8OkmMWfFfmc4GW3NvCog8fqGNEvidCxP37BsKo99iR9nIV-JnYSLuJFtmIRwXCIr50I72yqtzkLXzjZouO7ABvE3rJZkJAmzOgUy43nYQHg-dQTLIelfprdmX5gkaVU6xtZfWz6MDbEC2oT7jgITum8ER4ujzMLPclTMSiXTfu_W613QAVd-HXijOARb5Fm-DtKoDdmU2h9cBwN616fkMFM6_0E28x1c3uDCb80M9rGR33sICehXPyA"/>
</div>
</div>
</div>
</header>
<!-- Content Area -->
<main class="flex-1 overflow-y-auto p-4 bg-surface">
<div class="max-w-container-max mx-auto space-y-4">
<!-- Title & Actions -->
<div class="flex justify-between items-end">
<div>
<h1 class="font-headline-md text-xl text-on-surface">Workspace Overview</h1>
<p class="text-on-surface-variant font-body-md text-xs mt-1">Real-time automation health and sync status.</p>
</div>
<div class="flex gap-2">
<button class="flex items-center gap-2 px-3 py-1.5 border border-outline-variant text-on-surface-variant font-label-md text-xs rounded-lg hover:bg-surface-container-high transition-colors">
<span class="material-symbols-outlined text-sm">filter_list</span>
                            Filter View
                        </button>
<button class="flex items-center gap-2 px-3 py-1.5 bg-secondary text-on-secondary-fixed font-bold font-label-md text-xs rounded-lg hover:opacity-90 transition-all">
<span class="material-symbols-outlined text-sm">download</span>
                            Export Report
                        </button>
</div>
</div>
<!-- Metric Cards Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
<!-- Projects Synced -->
<div class="bg-[#1e293b] border border-outline-variant/30 p-4 rounded-xl transition-all duration-300 cyber-border-glow" style="border-color: rgba(73, 68, 84, 0.3);">
<div class="flex justify-between items-start mb-2">
<span class="material-symbols-outlined text-primary p-1 bg-primary/10 rounded-md text-sm">hub</span>
<span class="text-[10px] font-code text-tertiary">+1 this week</span>
</div>
<h3 class="font-label-md text-xs text-on-surface-variant">Projects Synced</h3>
<p class="font-headline-md text-2xl mt-1 text-on-surface">4</p>
</div>
<!-- Issues Analyzed -->
<div class="bg-[#1e293b] border border-outline-variant/30 p-4 rounded-xl transition-all duration-300 cyber-border-glow" style="border-color: rgba(73, 68, 84, 0.3);">
<div class="flex justify-between items-start mb-2">
<span class="material-symbols-outlined text-primary p-1 bg-primary/10 rounded-md text-sm">query_stats</span>
<span class="text-[10px] font-code text-tertiary">↑ 12%</span>
</div>
<h3 class="font-label-md text-xs text-on-surface-variant">Issues Analyzed</h3>
<p class="font-headline-md text-2xl mt-1 text-on-surface">128</p>
</div>
<!-- Tests Generated -->
<div class="bg-[#1e293b] border border-outline-variant/30 p-4 rounded-xl transition-all duration-300 cyber-border-glow" style="border-color: rgba(73, 68, 84, 0.3);">
<div class="flex justify-between items-start mb-2">
<span class="material-symbols-outlined text-primary p-1 bg-primary/10 rounded-md text-sm">auto_fix_high</span>
<span class="text-[10px] font-code text-tertiary">Live</span>
</div>
<h3 class="font-label-md text-xs text-on-surface-variant">Tests Generated</h3>
<p class="font-headline-md text-2xl mt-1 text-on-surface">1,024</p>
</div>
<!-- Success Rate -->
<div class="bg-[#1e293b] border border-outline-variant/30 p-4 rounded-xl transition-all duration-300 cyber-border-glow" style="border-color: rgba(73, 68, 84, 0.3);">
<div class="flex justify-between items-start mb-2">
<span class="material-symbols-outlined text-tertiary p-1 bg-tertiary/10 rounded-md text-sm" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span class="text-[10px] font-code text-on-surface-variant">Stable</span>
</div>
<h3 class="font-label-md text-xs text-on-surface-variant">Success Rate</h3>
<p class="font-headline-md text-2xl mt-1 text-tertiary">94%</p>
</div>
</div>
<!-- Active Projects Section -->
<section>
<div class="flex items-center justify-between mb-4">
<h2 class="font-headline-md text-lg text-on-surface">Active Projects</h2>
<a class="text-primary font-label-md text-xs hover:underline" href="#">View all</a>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
<!-- Project Card 1 -->
<div class="bg-[#1e293b] border border-outline-variant/30 rounded-xl p-4 group transition-all cyber-border-glow" style="border-color: rgba(73, 68, 84, 0.3);">
<div class="flex items-center gap-3 mb-4">
<div class="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined text-primary text-xl">shopping_cart</span>
</div>
<div>
<h4 class="font-title-lg text-sm font-bold text-on-surface">E-Commerce App</h4>
<span class="font-code text-[10px] text-on-surface-variant">KEY: ECO</span>
</div>
</div>
<div class="space-y-1 mb-4">
<div class="flex justify-between font-label-md text-[10px] mb-1">
<span class="text-on-surface-variant">Test Coverage</span>
<span class="text-on-surface">45%</span>
</div>
<div class="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
<div class="bg-primary h-full w-[45%] rounded-full"></div>
</div>
</div>
<button class="w-full py-2 border border-outline-variant text-on-surface-variant font-bold text-xs rounded-lg group-hover:border-primary group-hover:text-primary transition-all">
                                View Project
                            </button>
</div>
<!-- Project Card 2 -->
<div class="bg-[#1e293b] border border-outline-variant/30 rounded-xl p-4 group transition-all cyber-border-glow" style="border-color: rgba(73, 68, 84, 0.3);">
<div class="flex items-center gap-3 mb-4">
<div class="w-10 h-10 bg-secondary-container/20 rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined text-secondary text-xl">account_balance</span>
</div>
<div>
<h4 class="font-title-lg text-sm font-bold text-on-surface">FinTech API</h4>
<span class="font-code text-[10px] text-on-surface-variant">KEY: FIN</span>
</div>
</div>
<div class="space-y-1 mb-4">
<div class="flex justify-between font-label-md text-[10px] mb-1">
<span class="text-on-surface-variant">Test Coverage</span>
<span class="text-on-surface">82%</span>
</div>
<div class="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
<div class="bg-tertiary h-full w-[82%] rounded-full"></div>
</div>
</div>
<button class="w-full py-2 border border-outline-variant text-on-surface-variant font-bold text-xs rounded-lg group-hover:border-primary group-hover:text-primary transition-all">
                                View Project
                            </button>
</div>
<!-- Project Card 3 -->
<div class="bg-[#1e293b] border border-outline-variant/30 rounded-xl p-4 group transition-all cyber-border-glow" style="border-color: rgba(73, 68, 84, 0.3);">
<div class="flex items-center gap-3 mb-4">
<div class="w-10 h-10 bg-surface-variant rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined text-on-surface-variant text-xl">inventory_2</span>
</div>
<div>
<h4 class="font-title-lg text-sm font-bold text-on-surface">WMS Mobile</h4>
<span class="font-code text-[10px] text-on-surface-variant">KEY: WMS</span>
</div>
</div>
<div class="space-y-1 mb-4">
<div class="flex justify-between font-label-md text-[10px] mb-1">
<span class="text-on-surface-variant">Test Coverage</span>
<span class="text-on-surface">12%</span>
</div>
<div class="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
<div class="bg-primary-container h-full w-[12%] rounded-full"></div>
</div>
</div>
<button class="w-full py-2 border border-outline-variant text-on-surface-variant font-bold text-xs rounded-lg group-hover:border-primary group-hover:text-primary transition-all">
                                View Project
                            </button>
</div>
</div>
</section>
<!-- Recent Jira Issues Section -->
<section>
<div class="flex items-center justify-between mb-4">
<h2 class="font-headline-md text-lg text-on-surface">Recent Jira Issues</h2>
<div class="flex items-center gap-2">
<span class="font-label-md text-on-surface-variant text-[10px]">Auto-Sync: 2m ago</span>
<button class="p-1 hover:bg-surface-container-high rounded-lg text-primary">
<span class="material-symbols-outlined text-sm">refresh</span>
</button>
</div>
</div>
<div class="bg-[#1e293b] border border-outline-variant/30 rounded-xl overflow-hidden">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-container-high/50 border-b border-outline-variant/30">
<th class="px-4 py-2 font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">Issue Key</th>
<th class="px-4 py-2 font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">Summary</th>
<th class="px-4 py-2 font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">Type</th>
<th class="px-4 py-2 font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">AI Status</th>
<th class="px-4 py-2 font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant/20">
<!-- Row 1 -->
<tr class="hover:bg-surface-container/40 transition-colors">
<td class="px-4 py-2 font-code text-xs text-primary">ECO-102</td>
<td class="px-4 py-2 font-body-md text-sm text-on-surface">Implement VNPay checkout integration</td>
<td class="px-4 py-2">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-secondary-container text-sm" style="font-variation-settings: 'FILL' 1;">description</span>
<span class="text-[10px] text-on-surface-variant">User Story</span>
</div>
</td>
<td class="px-4 py-2">
<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary/10 border border-tertiary/30 text-tertiary text-[10px] font-bold">
<span class="w-1 h-1 rounded-full bg-tertiary"></span>
                                            Generated
                                        </span>
</td>
<td class="px-4 py-2 text-right">
<button class="p-1 hover:text-primary transition-colors">
<span class="material-symbols-outlined text-sm">more_vert</span>
</button>
</td>
</tr>
<!-- Row 2 -->
<tr class="hover:bg-surface-container/40 transition-colors">
<td class="px-4 py-2 font-code text-xs text-primary">ECO-105</td>
<td class="px-4 py-2 font-body-md text-sm text-on-surface">Fix session timeout on mobile safari</td>
<td class="px-4 py-2">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-error text-sm" style="font-variation-settings: 'FILL' 1;">pest_control</span>
<span class="text-[10px] text-on-surface-variant">Bug</span>
</div>
</td>
<td class="px-4 py-2">
<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] font-bold">
<span class="w-1 h-1 rounded-full bg-primary animate-pulse"></span>
                                            Analyzing...
                                        </span>
</td>
<td class="px-4 py-2 text-right">
<button class="p-1 hover:text-primary transition-colors">
<span class="material-symbols-outlined text-sm">more_vert</span>
</button>
</td>
</tr>
<!-- Row 3 -->
<tr class="hover:bg-surface-container/40 transition-colors">
<td class="px-4 py-2 font-code text-xs text-primary">ECO-108</td>
<td class="px-4 py-2 font-body-md text-sm text-on-surface">Add coupon code validation at cart</td>
<td class="px-4 py-2">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-secondary-container text-sm" style="font-variation-settings: 'FILL' 1;">description</span>
<span class="text-[10px] text-on-surface-variant">User Story</span>
</div>
</td>
<td class="px-4 py-2">
<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-variant border border-outline-variant text-on-surface-variant text-[10px] font-bold">
                                            Pending
                                        </span>
</td>
<td class="px-4 py-2 text-right">
<button class="p-1 hover:text-primary transition-colors">
<span class="material-symbols-outlined text-sm">more_vert</span>
</button>
</td>
</tr>
<!-- Row 4: Skeleton 1 -->
<tr class="opacity-50">
<td class="px-4 py-2"><div class="h-3 w-12 skeleton rounded"></div></td>
<td class="px-4 py-2"><div class="h-3 w-48 skeleton rounded"></div></td>
<td class="px-4 py-2"><div class="h-3 w-16 skeleton rounded"></div></td>
<td class="px-4 py-2"><div class="h-4 w-20 skeleton rounded-full"></div></td>
<td class="px-4 py-2 text-right"><div class="h-3 w-3 ml-auto skeleton rounded-full"></div></td>
</tr>
<!-- Row 5: Skeleton 2 -->
<tr class="opacity-30">
<td class="px-4 py-2"><div class="h-3 w-12 skeleton rounded"></div></td>
<td class="px-4 py-2"><div class="h-3 w-32 skeleton rounded"></div></td>
<td class="px-4 py-2"><div class="h-3 w-16 skeleton rounded"></div></td>
<td class="px-4 py-2"><div class="h-4 w-20 skeleton rounded-full"></div></td>
<td class="px-4 py-2 text-right"><div class="h-3 w-3 ml-auto skeleton rounded-full"></div></td>
</tr>
</tbody>
</table>
</div>
</section>
</div>
</main>
</div>
<!-- Micro-interaction Scripts -->
<script>
        document.addEventListener('DOMContentLoaded', () => {
            // Hover effect for Metric Cards - Enhanced 
            const cards = document.querySelectorAll('.cyber-border-glow');
            cards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.borderColor = 'rgba(208, 188, 255, 0.4)';
                });
                card.addEventListener('mouseleave', () => {
                    card.style.borderColor = 'rgba(73, 68, 84, 0.3)';
                });
            });

            // Console hint
            console.log("JiraAutoTest Dashboard Initialized. Systems: Stable.");
        });
    </script>
</body></html>