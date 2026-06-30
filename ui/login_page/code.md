<!DOCTYPE html><html class="dark" lang="en" style=""><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>JiraAutoTest - Login</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "tertiary-fixed": "#6ffbbe",
                      "secondary": "#adc6ff",
                      "primary": "#d0bcff",
                      "on-tertiary-fixed": "#002113",
                      "on-secondary-container": "#e6ecff",
                      "on-primary-fixed-variant": "#5516be",
                      "surface-container-highest": "#2d3449",
                      "primary-fixed": "#e9ddff",
                      "surface-container-low": "#131b2e",
                      "inverse-on-surface": "#283044",
                      "secondary-container": "#0566d9",
                      "primary-container": "#a078ff",
                      "on-error": "#690005",
                      "surface-variant": "#2d3449",
                      "surface": "#0b1326",
                      "on-secondary": "#002e6a",
                      "tertiary-fixed-dim": "#4edea3",
                      "on-tertiary-fixed-variant": "#005236",
                      "inverse-surface": "#dae2fd",
                      "surface-container": "#171f33",
                      "secondary-fixed-dim": "#adc6ff",
                      "on-secondary-fixed": "#001a42",
                      "outline-variant": "#494454",
                      "on-error-container": "#ffdad6",
                      "error": "#ffb4ab",
                      "secondary-fixed": "#d8e2ff",
                      "on-primary-container": "#340080",
                      "tertiary-container": "#00a572",
                      "background": "#0b1326",
                      "tertiary": "#4edea3",
                      "on-secondary-fixed-variant": "#004395",
                      "surface-dim": "#0b1326",
                      "on-background": "#dae2fd",
                      "outline": "#958ea0",
                      "surface-tint": "#d0bcff",
                      "surface-bright": "#31394d",
                      "on-tertiary-container": "#00311f",
                      "on-surface-variant": "#cbc3d7",
                      "on-tertiary": "#003824",
                      "on-primary": "#3c0091",
                      "on-primary-fixed": "#23005c",
                      "on-surface": "#dae2fd",
                      "error-container": "#93000a",
                      "inverse-primary": "#6d3bd7",
                      "primary-fixed-dim": "#d0bcff",
                      "surface-container-lowest": "#060e20",
                      "surface-container-high": "#222a3d"
              },
              "borderRadius": {
                      "DEFAULT": "0.125rem",
                      "lg": "0.25rem",
                      "xl": "0.5rem",
                      "full": "0.75rem"
              },
              "spacing": {
                      "2xl": "48px",
                      "container-max": "1440px",
                      "md": "16px",
                      "3xl": "64px",
                      "lg": "24px",
                      "xs": "4px",
                      "base": "4px",
                      "xl": "32px",
                      "gutter": "24px",
                      "sm": "8px"
              },
              "fontFamily": {
                      "headline-lg-mobile": ["Geist"],
                      "headline-lg": ["Geist"],
                      "display": ["Geist"],
                      "headline-md": ["Geist"],
                      "body-md": ["Geist"],
                      "code": ["jetbrainsMono"],
                      "body-lg": ["Geist"],
                      "title-lg": ["Geist"],
                      "label-md": ["Geist"]
              },
              "fontSize": {
                      "headline-lg-mobile": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                      "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                      "display": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                      "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                      "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                      "code": ["13px", {"lineHeight": "18px", "fontWeight": "400"}],
                      "body-lg": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                      "title-lg": ["20px", {"lineHeight": "28px", "fontWeight": "500"}],
                      "label-md": ["12px", {"lineHeight": "16px", "letterSpacing": "0.02em", "fontWeight": "500"}]
              }
            },
          },
        }
    </script>
<style>
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=JetBrains+Mono:wght@400&display=swap');
    </style>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&amp;family=JetBrains+Mono:wght@400&amp;display=swap" data-snapdom="injected-import"></head>
<body class="bg-background text-on-background font-body-md antialiased min-h-screen flex selection:bg-primary-container selection:text-on-primary-container">
<div class="flex flex-col md:flex-row w-full min-h-screen">
<!-- Left Side: Auth Form -->
<div class="w-full md:w-1/2 flex items-center justify-center p-lg relative z-10 bg-surface">
<div class="w-full max-w-md space-y-xl">
<!-- Branding -->
<div class="flex items-center gap-sm mb-2xl"><span class="material-symbols-outlined text-primary font-variation-settings: 'FILL' 1; text-3xl">bug_report</span><span class="font-headline-md text-headline-md text-on-surface">JiraAutoTest</span></div>
<!-- Header -->
<div class="space-y-sm">
<h1 class="font-headline-lg text-headline-lg md:font-display md:text-display text-on-surface">Welcome Back</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant">Enter your details to access your automation dashboard.</p>
</div>
<!-- Form -->
<form class="space-y-lg">
<div class="space-y-sm">
<label class="font-label-md text-label-md text-on-surface" for="email">Email Address</label>
<input class="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm placeholder:text-on-surface-variant/50" id="email" placeholder="name@company.com" type="email">
</div>
<div class="space-y-sm">
<label class="font-label-md text-label-md text-on-surface" for="password">Password</label>
<div class="relative">
<input class="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm placeholder:text-on-surface-variant/50" id="password" placeholder="••••••••" type="password">
<button class="absolute inset-y-0 right-0 flex items-center pr-md text-on-surface-variant hover:text-on-surface focus:outline-none" type="button">
<span class="material-symbols-outlined text-lg">visibility_off</span>
</button>
</div>
</div>
<div class="flex items-center justify-between">
<div class="flex items-center">
<input class="w-4 h-4 rounded bg-surface-container-highest border-outline-variant text-primary focus:ring-primary focus:ring-offset-surface" id="remember" type="checkbox">
<label class="ml-sm font-label-md text-label-md text-on-surface-variant" for="remember">Remember me</label>
</div>
<a class="font-label-md text-label-md text-primary hover:text-primary-fixed-dim transition-colors" href="#">Forgot Password?</a>
</div>
<button class="w-full bg-gradient-to-r from-primary to-inverse-primary hover:from-primary-fixed-dim hover:to-primary text-on-primary font-title-lg text-title-lg py-sm rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-px flex items-center justify-center gap-sm" type="submit">
                        Sign In
                        <span class="material-symbols-outlined text-base">arrow_forward</span>
</button>
</form>
<!-- Social Login -->
<div class="mt-xl">
<div class="relative">
<div class="absolute inset-0 flex items-center">
<div class="w-full border-t border-outline-variant"></div>
</div>
<div class="relative flex justify-center text-sm">
<span class="px-md bg-surface font-label-md text-label-md text-on-surface-variant">Or continue with</span>
</div>
</div>
<div class="mt-lg grid grid-cols-2 gap-md">
<button class="flex items-center justify-center gap-sm px-md py-sm bg-surface-container-highest border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-high hover:border-primary/50 transition-colors shadow-sm">
<svg aria-hidden="true" class="w-5 h-5 text-on-surface" fill="currentColor" viewBox="0 0 24 24">
<path clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fill-rule="evenodd"></path>
</svg>
                            GitHub
                        </button>
<button class="flex items-center justify-center gap-sm px-md py-sm bg-surface-container-highest border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-high hover:border-primary/50 transition-colors shadow-sm">
<svg aria-hidden="true" class="w-5 h-5" viewBox="0 0 24 24">
<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
</svg>
                            Google
                        </button>
</div>
</div>
<!-- Footer -->
<p class="text-center font-label-md text-label-md text-on-surface-variant mt-xl">
                    Don't have an account? <a class="text-primary hover:text-primary-fixed-dim transition-colors ml-xs" href="#">Sign Up</a>
</p>
</div>
</div>
<!-- Right Side: Visual -->
<div class="hidden md:flex md:w-1/2 relative overflow-hidden bg-surface-container-lowest items-center justify-center border-l border-outline-variant/30">
<!-- Image Background (Placeholder with data-alt for visual prompt) -->
<div class="absolute inset-0 w-full h-full bg-cover bg-center opacity-80 mix-blend-screen" data-alt="A high-impact, abstract cyber-themed background featuring deep, rich purples (#8b5cf6) and vibrant electric blues. The composition includes a subtle, glowing technological mesh or geometric grid pattern fading into a dark, premium Slate-900 abyss. The lighting is dramatic and moody, emphasizing a sophisticated, high-performance DevOps environment with a sleek glassmorphism aesthetic." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAoVjl6c1vsDPjiCcVycuy9VjJ-ObU0cvEu_t3TE-4H4jjnzfGJMcoIKOs30noQGXB1t_cOE92SOYRTD-c_xbxbYIEpjozGcC4sry4OhVw0H3t-ZGTF29eunvKR4nrZJMTFbqUNrZ8yDR2yiVmQExRYe_XPLRqYCZWJsV_6TNYN8h0vFT8OyNL2p1GtdPlmOCRzhduPqRJRG2BZyNtziUhjdVTr3avKP-CgkqKFL8BL3zCU95HbxvT2jI1thCEKBjArB6PbxKFXwSs')"></div>
<!-- Overlay Gradient -->
<div class="absolute inset-0 bg-gradient-to-br from-surface/80 via-surface/60 to-surface-container-lowest/90 backdrop-blur-[2px]"></div>
<!-- Content overlay -->
<div class="relative z-10 text-center px-2xl max-w-lg">
<h2 class="font-display text-display text-on-surface tracking-tight leading-tight drop-shadow-2xl">
                    Connecting <br>
<span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Automation</span> <br>
                    to Quality
                </h2>
<div class="mt-lg w-24 h-1 bg-gradient-to-r from-primary to-transparent mx-auto rounded-full"></div>
</div>
<!-- Decorative Glow -->
<div class="absolute bottom-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
<div class="absolute top-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] pointer-events-none"></div>
</div>
</div>


</body></html>