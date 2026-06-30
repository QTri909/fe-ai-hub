<!DOCTYPE html><html class="dark" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>JiraAutoTest - Automate Your QA Workflow</title>
<!-- Google Fonts & Icons -->
<link href="https://fonts.googleapis.com" rel="preconnect">
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Tailwind Configuration -->
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "secondary-fixed-dim": "#adc6ff",
                        "on-secondary-fixed": "#001a42",
                        "outline-variant": "#494454",
                        "on-secondary": "#002e6a",
                        "on-tertiary-fixed-variant": "#005236",
                        "tertiary-fixed-dim": "#4edea3",
                        "inverse-surface": "#dae2fd",
                        "surface-container": "#171f33",
                        "surface-container-low": "#131b2e",
                        "inverse-on-surface": "#283044",
                        "primary-fixed": "#e9ddff",
                        "on-error": "#690005",
                        "primary-container": "#a078ff",
                        "secondary-container": "#0566d9",
                        "surface-variant": "#2d3449",
                        "surface": "#0b1326",
                        "tertiary-fixed": "#6ffbbe",
                        "primary": "#d0bcff",
                        "secondary": "#adc6ff",
                        "on-tertiary-fixed": "#002113",
                        "on-secondary-container": "#e6ecff",
                        "surface-container-highest": "#2d3449",
                        "on-primary-fixed-variant": "#5516be",
                        "error-container": "#93000a",
                        "on-surface": "#dae2fd",
                        "inverse-primary": "#6d3bd7",
                        "primary-fixed-dim": "#d0bcff",
                        "surface-container-high": "#222a3d",
                        "surface-container-lowest": "#060e20",
                        "on-surface-variant": "#cbc3d7",
                        "on-tertiary-container": "#00311f",
                        "on-tertiary": "#003824",
                        "on-primary": "#3c0091",
                        "on-primary-fixed": "#23005c",
                        "on-background": "#dae2fd",
                        "outline": "#958ea0",
                        "surface-tint": "#d0bcff",
                        "surface-bright": "#31394d",
                        "error": "#ffb4ab",
                        "on-error-container": "#ffdad6",
                        "on-primary-container": "#340080",
                        "secondary-fixed": "#d8e2ff",
                        "tertiary": "#4edea3",
                        "on-secondary-fixed-variant": "#004395",
                        "tertiary-container": "#00a572",
                        "background": "#0b1326",
                        "surface-dim": "#0b1326"
                    },
                    borderRadius: {
                        "DEFAULT": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "0.75rem"
                    },
                    spacing: {
                        "base": "4px",
                        "xl": "32px",
                        "gutter": "24px",
                        "sm": "8px",
                        "2xl": "48px",
                        "container-max": "1440px",
                        "3xl": "64px",
                        "md": "16px",
                        "xs": "4px",
                        "lg": "24px"
                    },
                    fontFamily: {
                        "headline-md": ["Geist"],
                        "headline-lg-mobile": ["Geist"],
                        "display": ["Geist"],
                        "headline-lg": ["Geist"],
                        "body-md": ["Geist"],
                        "body-lg": ["Geist"],
                        "label-md": ["Geist"],
                        "title-lg": ["Geist"],
                        "code": ["jetbrainsMono"]
                    },
                    fontSize: {
                        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
                        "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "600" }],
                        "display": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
                        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }],
                        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
                        "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }],
                        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "500" }],
                        "title-lg": ["20px", { lineHeight: "28px", fontWeight: "500" }],
                        "code": ["13px", { lineHeight: "18px", fontWeight: "400" }]
                    },
                    animation: {
                        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        'flow': 'flow 2s linear infinite',
                    },
                    keyframes: {
                        flow: {
                            '0%': { strokeDashoffset: '24' },
                            '100%': { strokeDashoffset: '0' },
                        }
                    }
                }
            }
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        .icon-fill {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        
        /* Custom scrollbar for raw terminal look */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #0b1326; 
        }
        ::-webkit-scrollbar-thumb {
            background: #2d3449; 
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #494454; 
        }

        /* Border Glow Effect */
        .hover-glow:hover {
            border-color: #a078ff;
            box-shadow: 0 0 10px rgba(160, 120, 255, 0.1);
            transform: translateY(-2px);
        }
    </style>
</head>
<body class="bg-surface text-on-surface font-body-lg antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
<!-- 1. TopNavBar (JSON) -->
<nav class="fixed top-0 w-full z-50 bg-surface/70 dark:bg-surface/70 backdrop-blur-xl border-b border-surface-variant/50 shadow-sm font-body-md text-body-md">
<div class="flex justify-between items-center px-lg py-md max-w-container-max mx-auto">
<div class="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-sm">
<span class="material-symbols-outlined text-primary">workflow</span>
                JiraAutoTest
            </div>
<div class="hidden md:flex gap-lg items-center">
<!-- Using inactive styles for landing page top nav by default -->
<a class="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 active:scale-95 transition-transform" href="#features">Features</a>
<a class="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 active:scale-95 transition-transform" href="#architecture">Architecture</a>
<a class="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 active:scale-95 transition-transform" href="#dashboard">Dashboard</a>
<a class="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 active:scale-95 transition-transform" href="#pricing">Pricing</a>
</div>
<button class="bg-primary-container text-on-primary-container px-md py-sm rounded hover:opacity-90 transition-opacity active:scale-95 transition-transform font-bold">
                Get Started
            </button>
</div>
</nav>
<main class="flex-grow pt-32">
<!-- 2. Hero Section -->
<section class="max-w-container-max mx-auto px-lg flex flex-col items-center text-center pb-3xl relative">
<!-- Subtle background glow -->
<div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-primary-container/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
<h1 class="font-display text-display md:text-[56px] leading-tight max-w-4xl mb-lg">
                Automate Your Tests. <br>
<span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Sync Bugs to Jira Instantly.</span>
</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mb-xl">
                Eliminate manual bug reporting. Trigger test suites on code commits, catch regressions, and let AI-driven agents log rich Jira tickets with full stack traces and screenshots automatically.
            </p>
<div class="flex flex-col sm:flex-row gap-md mb-3xl">
<button class="flex items-center gap-sm bg-primary text-on-primary px-lg py-md rounded font-bold hover:brightness-110 transition-all active:scale-95">
<span class="material-symbols-outlined icon-fill">play_arrow</span>
                    Watch Demo
                </button>
<button class="flex items-center gap-sm border border-surface-variant bg-surface-container-low text-on-surface px-lg py-md rounded hover:border-primary hover:text-primary transition-all active:scale-95">
                    Explore Docs
                </button>
</div>
<!-- Split-pane Mockup -->
<div class="w-full max-w-5xl bg-surface-container rounded-xl border border-surface-variant shadow-2xl overflow-hidden flex flex-col md:flex-row text-left relative">
<!-- Glowing divider line -->
<div class="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent z-10"></div>
<!-- Left: Code Editor -->
<div class="flex-1 p-md bg-[#0d1117] relative border-b md:border-b-0 md:border-r border-surface-variant">
<div class="flex gap-2 mb-md">
<div class="w-3 h-3 rounded-full bg-surface-variant"></div>
<div class="w-3 h-3 rounded-full bg-surface-variant"></div>
<div class="w-3 h-3 rounded-full bg-surface-variant"></div>
</div>
<pre class="font-code text-code text-on-surface-variant overflow-x-auto"><code class="language-js">
<span class="text-primary-fixed">describe</span>('Authentication Flow', () =&gt; {
  <span class="text-tertiary">it</span>('should login user successfully', async () =&gt; {
    <span class="text-[#8b949e]">// PASS</span>
    await auth.login('user', 'pass');
    expect(auth.state).toBe('logged_in');
  });

  <span class="text-error">it</span>('should handle 2FA timeout', async () =&gt; {
    <span class="text-[#8b949e]">// FAIL - Timeout exceeded</span>
    await auth.trigger2FA();
    <span class="bg-error-container/20 text-error px-1">expect(auth.modal).toBeVisible();</span>
    <span class="text-error">^ AssertionError: expected hidden to be visible</span>
  });
});
                    </code></pre>
</div>
<!-- Right: Jira Ticket -->
<div class="flex-1 p-xl bg-surface-container-low flex flex-col justify-center items-center relative overflow-hidden">
<!-- Animation Path connecting code to ticket -->
<svg class="absolute top-1/2 left-0 w-24 h-8 -translate-x-12 -translate-y-1/2 text-primary hidden md:block" fill="none" viewBox="0 0 100 20">
<path class="animate-flow" d="M0 10 L100 10" stroke="currentColor" stroke-dasharray="6 6" stroke-width="2"></path>
<circle class="animate-pulse" cx="100" cy="10" fill="currentColor" r="4"></circle>
</svg>
<div class="w-full max-w-sm bg-surface border border-surface-variant rounded-lg p-md shadow-sm">
<div class="flex justify-between items-center mb-sm border-b border-surface-variant pb-sm">
<span class="font-code text-[11px] text-on-surface-variant bg-surface-variant px-2 py-1 rounded">JAT-1042</span>
<span class="flex items-center gap-1 text-[11px] text-error bg-error-container/20 px-2 py-1 rounded">
<span class="material-symbols-outlined text-[14px]">error</span> Bug
                            </span>
</div>
<h3 class="font-title-lg text-title-lg font-bold mb-xs">2FA Modal Visibility Failure</h3>
<p class="font-body-md text-body-md text-on-surface-variant mb-md">AssertionError: expected hidden to be visible during 2FA timeout flow.</p>
<div class="bg-surface-container-lowest p-sm rounded border border-surface-variant/50 font-code text-[11px] text-on-surface-variant mb-md">
                            Stack Trace attached.<br>
                            Screenshot: 2fa_timeout_err.png
                        </div>
<div class="flex justify-between items-center pt-sm border-t border-surface-variant">
<div class="flex items-center gap-sm">
<div class="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[10px]">AI</div>
<span class="text-[12px] text-on-surface-variant">Auto-created by JAT</span>
</div>
<span class="text-[12px] text-primary">To Do</span>
</div>
</div>
</div>
</div>
</section>
<!-- 3. Pain Points vs Solution -->
<section class="bg-surface-container-low border-y border-surface-variant py-2xl">
<div class="max-w-container-max mx-auto px-lg">
<div class="text-center mb-xl">
<h2 class="font-headline-lg text-headline-lg mb-sm">Why switch to JAT?</h2>
<p class="text-on-surface-variant">Leave the manual grunt work behind.</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-xl">
<!-- The Old Way -->
<div class="bg-surface border border-surface-variant rounded-lg p-xl opacity-80">
<div class="flex items-center gap-sm mb-lg text-on-surface-variant">
<span class="material-symbols-outlined text-error">close</span>
<h3 class="font-title-lg text-title-lg">The Old Way</h3>
</div>
<ul class="space-y-md text-on-surface-variant font-body-md">
<li class="flex items-start gap-sm"><span class="material-symbols-outlined text-[18px] mt-0.5">remove</span> Manual copy-pasting of logs.</li>
<li class="flex items-start gap-sm"><span class="material-symbols-outlined text-[18px] mt-0.5">remove</span> Missing contextual screenshots.</li>
<li class="flex items-start gap-sm"><span class="material-symbols-outlined text-[18px] mt-0.5">remove</span> Delayed feedback loops.</li>
<li class="flex items-start gap-sm"><span class="material-symbols-outlined text-[18px] mt-0.5">remove</span> Stale Jira ticket statuses.</li>
</ul>
</div>
<!-- The JAT Way -->
<div class="bg-surface-container border border-primary/50 rounded-lg p-xl relative overflow-hidden shadow-[0_0_30px_rgba(160,120,255,0.05)]">
<!-- subtle bg glow -->
<div class="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-2xl rounded-full"></div>
<div class="flex items-center gap-sm mb-lg text-primary">
<span class="material-symbols-outlined icon-fill">check_circle</span>
<h3 class="font-title-lg text-title-lg font-bold">The JAT Way</h3>
</div>
<ul class="space-y-md text-on-surface font-body-md relative z-10">
<li class="flex items-start gap-sm"><span class="material-symbols-outlined text-tertiary text-[18px] mt-0.5">check</span> Instant API sync &amp; auto-creation.</li>
<li class="flex items-start gap-sm"><span class="material-symbols-outlined text-tertiary text-[18px] mt-0.5">check</span> Auto-generated steps to reproduce.</li>
<li class="flex items-start gap-sm"><span class="material-symbols-outlined text-tertiary text-[18px] mt-0.5">check</span> Real-time Slack/Jira notifications.</li>
<li class="flex items-start gap-sm"><span class="material-symbols-outlined text-tertiary text-[18px] mt-0.5">check</span> Bi-directional status updates.</li>
</ul>
</div>
</div>
</div>
</section>
<!-- 4. Core Features Grid -->
<section class="py-3xl max-w-container-max mx-auto px-lg" id="features">
<h2 class="font-headline-lg text-headline-lg text-center mb-2xl">High-Performance Automation Core</h2>
<div class="grid grid-cols-1 md:grid-cols-2 gap-lg">
<!-- Card 1 -->
<div class="bg-surface-container border border-surface-variant rounded-lg p-xl transition-all duration-300 hover-glow group cursor-default">
<div class="w-12 h-12 bg-surface border border-surface-variant rounded flex items-center justify-center mb-md group-hover:bg-primary/10 group-hover:border-primary/50 transition-colors">
<span class="material-symbols-outlined text-secondary">bolt</span>
</div>
<h3 class="font-title-lg text-title-lg font-bold mb-sm">Smart Triggering</h3>
<p class="text-on-surface-variant font-body-md leading-relaxed">
                        Run suites via CI/CD pipelines (GitHub Actions, Jenkins, GitLab). Intelligent heuristics ensure only relevant tests run based on code diffs.
                    </p>
</div>
<!-- Card 2 -->
<div class="bg-surface-container border border-surface-variant rounded-lg p-xl transition-all duration-300 hover-glow group cursor-default">
<div class="w-12 h-12 bg-surface border border-surface-variant rounded flex items-center justify-center mb-md group-hover:bg-primary/10 group-hover:border-primary/50 transition-colors">
<span class="material-symbols-outlined text-secondary">bug_report</span>
</div>
<h3 class="font-title-lg text-title-lg font-bold mb-sm">Auto Bug Logging</h3>
<p class="text-on-surface-variant font-body-md leading-relaxed">
                        Create rich Jira tickets with deep stack traces, DOM snapshots, and video recordings automatically on test failure.
                    </p>
</div>
<!-- Card 3 -->
<div class="bg-surface-container border border-surface-variant rounded-lg p-xl transition-all duration-300 hover-glow group cursor-default">
<div class="w-12 h-12 bg-surface border border-surface-variant rounded flex items-center justify-center mb-md group-hover:bg-primary/10 group-hover:border-primary/50 transition-colors">
<span class="material-symbols-outlined text-secondary">sync_alt</span>
</div>
<h3 class="font-title-lg text-title-lg font-bold mb-sm">Bi-directional Sync</h3>
<p class="text-on-surface-variant font-body-md leading-relaxed">
                        Status updates flow both ways. If a test passes on main branch, the associated Jira ticket is automatically transitioned to 'Done'.
                    </p>
</div>
<!-- Card 4 -->
<div class="bg-surface-container border border-surface-variant rounded-lg p-xl transition-all duration-300 hover-glow group cursor-default">
<div class="w-12 h-12 bg-surface border border-surface-variant rounded flex items-center justify-center mb-md group-hover:bg-primary/10 group-hover:border-primary/50 transition-colors">
<span class="material-symbols-outlined text-secondary">monitoring</span>
</div>
<h3 class="font-title-lg text-title-lg font-bold mb-sm">Insightful Analytics</h3>
<p class="text-on-surface-variant font-body-md leading-relaxed">
                        Gain visibility with comprehensive dashboards showing Test Pass/Fail ratios, flakiness scores, and team resolution velocity.
                    </p>
</div>
</div>
</section>
<!-- 6. Dashboard Preview (Skipping full arch section for brevity in effort 0.25, merging concept into preview) -->
<section class="py-2xl bg-surface border-t border-surface-variant" id="dashboard">
<div class="max-w-container-max mx-auto px-lg">
<div class="text-center mb-xl">
<h2 class="font-headline-lg text-headline-lg mb-sm">Command Center</h2>
<p class="text-on-surface-variant">Everything you need, visible at a glance.</p>
</div>
<!-- Dashboard Mockup -->
<div class="bg-surface-container rounded-xl border border-surface-variant shadow-2xl overflow-hidden flex h-[500px]">
<!-- Sidebar -->
<div class="w-16 border-r border-surface-variant bg-surface flex flex-col items-center py-md gap-lg hidden sm:flex">
<div class="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary mb-xl">
<span class="material-symbols-outlined text-[20px]">dashboard</span>
</div>
<span class="material-symbols-outlined text-on-surface-variant hover:text-on-surface cursor-pointer">analytics</span>
<span class="material-symbols-outlined text-on-surface-variant hover:text-on-surface cursor-pointer">list_alt</span>
<span class="material-symbols-outlined text-on-surface-variant hover:text-on-surface cursor-pointer mt-auto">settings</span>
</div>
<!-- Main Content -->
<div class="flex-1 p-lg flex flex-col gap-lg bg-[#0b1326] overflow-y-auto">
<h3 class="font-title-lg font-bold text-on-surface border-b border-surface-variant pb-sm">Overview</h3>
<!-- Metrics Row -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-md">
<div class="bg-surface-container-low border border-surface-variant p-md rounded flex flex-col">
<span class="text-label-md text-on-surface-variant mb-1">Total Executions</span>
<span class="text-headline-md font-bold text-on-surface">1,240</span>
<span class="text-[10px] text-tertiary mt-1">+12% this week</span>
</div>
<div class="bg-surface-container-low border border-surface-variant p-md rounded flex flex-col">
<span class="text-label-md text-on-surface-variant mb-1">Success Rate</span>
<span class="text-headline-md font-bold text-tertiary">94.2%</span>
<span class="text-[10px] text-on-surface-variant mt-1">Target: &gt;95%</span>
</div>
<div class="bg-surface-container-low border border-surface-variant p-md rounded flex flex-col">
<span class="text-label-md text-on-surface-variant mb-1">Bugs Auto-Created</span>
<span class="text-headline-md font-bold text-error">14</span>
<span class="text-[10px] text-error mt-1">-3 pending review</span>
</div>
</div>
<!-- Recent Table -->
<div class="bg-surface-container-low border border-surface-variant rounded flex-1 overflow-hidden flex flex-col">
<div class="px-md py-sm border-b border-surface-variant bg-surface flex justify-between items-center">
<span class="font-label-md font-bold">Recent Executions</span>
<span class="material-symbols-outlined text-[16px] text-on-surface-variant cursor-pointer">more_horiz</span>
</div>
<div class="p-0">
<div class="flex px-md py-sm border-b border-surface-variant/50 text-label-md text-on-surface-variant">
<div class="flex-1">Suite</div>
<div class="w-24">Duration</div>
<div class="w-24">Status</div>
</div>
<div class="flex px-md py-sm border-b border-surface-variant/50 items-center text-body-md hover:bg-surface-variant/20 cursor-pointer">
<div class="flex-1 font-code text-[12px]">E2E_Checkout_Flow</div>
<div class="w-24 text-on-surface-variant text-[12px]">2m 14s</div>
<div class="w-24"><span class="text-[10px] px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container">Passed</span></div>
</div>
<div class="flex px-md py-sm border-b border-surface-variant/50 items-center text-body-md hover:bg-surface-variant/20 cursor-pointer">
<div class="flex-1 font-code text-[12px]">API_Auth_Regression</div>
<div class="w-24 text-on-surface-variant text-[12px]">45s</div>
<div class="w-24"><span class="text-[10px] px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container">Passed</span></div>
</div>
<div class="flex px-md py-sm items-center text-body-md hover:bg-surface-variant/20 cursor-pointer">
<div class="flex-1 font-code text-[12px]">UI_Dashboard_Metrics</div>
<div class="w-24 text-on-surface-variant text-[12px]">1m 02s</div>
<div class="w-24 flex items-center gap-1">
<span class="text-[10px] px-2 py-0.5 rounded-full bg-error-container text-on-error-container">Failed</span>
<span class="material-symbols-outlined text-[14px] text-error" title="Jira Ticket Auto-created">bug_report</span>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- 7. CTA Footer Banner -->
<section class="py-3xl relative overflow-hidden bg-surface-container-high border-y border-surface-variant">
<div class="absolute inset-0 bg-gradient-to-r from-primary-container/10 to-secondary-container/10 pointer-events-none"></div>
<div class="max-w-2xl mx-auto px-lg text-center relative z-10">
<h2 class="font-headline-lg text-headline-lg font-bold text-on-surface mb-md">Ready to accelerate your QA workflow?</h2>
<p class="text-body-lg text-on-surface-variant mb-xl">Join thousands of engineering teams deploying with confidence.</p>
<button class="bg-primary text-on-primary px-xl py-md rounded-lg font-bold text-title-lg hover:shadow-[0_0_20px_rgba(208,188,255,0.4)] transition-all active:scale-95">
                    Start Free Trial
                </button>
</div>
</section>
</main>
<!-- 8. Footer (JSON) -->
<footer class="bg-surface-container-lowest dark:bg-surface-container-lowest text-secondary font-label-md text-label-md w-full py-xl border-t border-surface-variant flat no shadows">
<div class="flex flex-col md:flex-row justify-between items-center px-lg max-w-container-max mx-auto gap-md">
<div class="font-title-lg text-title-lg font-bold text-on-surface flex items-center gap-sm">
<span class="material-symbols-outlined">bug_report</span>
                JiraAutoTest
            </div>
<div class="flex flex-wrap gap-md items-center justify-center text-on-surface-variant">
<a class="hover:text-tertiary transition-colors opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
<a class="hover:text-tertiary transition-colors opacity-80 hover:opacity-100" href="#">Terms of Service</a>
<a class="hover:text-tertiary transition-colors opacity-80 hover:opacity-100" href="#">Documentation</a>
<a class="hover:text-tertiary transition-colors opacity-80 hover:opacity-100" href="#">Support</a>
</div>
<div class="text-on-surface-variant opacity-80">
                © 2024 JiraAutoTest. All rights reserved.
            </div>
</div>
</footer>


</body></html>