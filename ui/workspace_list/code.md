<!DOCTYPE html>
<html class="dark" lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Workspaces | JiraAutoTest</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=JetBrains+Mono:wght@100..800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
    
    <!-- Reuse Tailwind config from workspace_detail -->
    <script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              primary: "#d0bcff",
              tertiary: "#4edea3",
              "surface": "#0b1326",
              "surface-container-lowest": "#060e20",
              "surface-container-low": "#131b2e",
              "surface-container-high": "#222a3d",
              "on-surface": "#dae2fd",
              "on-surface-variant": "#cbc3d7",
              "outline-variant": "#494454",
              "primary-container": "#a078ff"
            },
            fontFamily: {
              "headline-md": ["Geist"],
              "body-md": ["Geist"],
              "label-md": ["Geist"],
              "code": ["JetBrains Mono"]
            }
          }
        }
      }
    </script>
    <style>
        body {
            background-color: #0b1326;
            color: #dae2fd;
            font-family: 'Geist', sans-serif;
            background-image: radial-gradient(circle at 50% -20%, #171f33 0%, #0b1326 70%);
            background-attachment: fixed;
        }
        .cyber-border-glow {
            border: 1px solid rgba(73, 68, 84, 0.4);
            transition: all 0.3s ease;
        }
        .cyber-border-glow:hover {
            border-color: #d0bcff;
            box-shadow: 0 0 20px rgba(208, 188, 255, 0.15);
            transform: translateY(-4px);
        }
        .glass-nav {
            backdrop-filter: blur(12px);
            background-color: rgba(11, 19, 38, 0.7);
            border-bottom: 1px solid rgba(73, 68, 84, 0.3);
        }
    </style>
</head>
<body class="min-h-screen flex flex-col">

<!-- Top Navigation -->
<header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 glass-nav">
    <div class="flex items-center gap-4">
        <span class="font-headline-md text-2xl font-bold text-primary tracking-tight">JiraAutoTest</span>
    </div>
    <div class="flex items-center gap-4">
        <div class="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-sm">JD</div>
        <button class="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">logout</span> Logout
        </button>
    </div>
</header>

<main class="flex-grow pt-28 pb-16 px-6 flex justify-center">
    <div class="max-w-[1200px] w-full">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
                <h1 class="font-headline-md text-3xl font-bold text-on-surface mb-2">Your Workspaces</h1>
                <p class="font-body-md text-on-surface-variant">Select a workspace to view dashboard or manage automation projects.</p>
            </div>
            <!-- Nút tạo Workspace mới điều hướng về trang Create -->
            <a href="../workspace/code.md" class="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#a078ff] to-[#6d3bd7] text-white font-bold hover:shadow-[0_0_20px_rgba(160,120,255,0.4)] transition-all hover:scale-105 active:scale-95">
                <span class="material-symbols-outlined">add</span>
                Connect New Workspace
            </a>
        </div>

        <!-- Workspace Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <!-- Card 1: Active Workspace -->
            <a href="../workspace_detail/code.md" class="bg-surface-container-low rounded-xl p-6 cyber-border-glow cursor-pointer group flex flex-col h-full relative overflow-hidden">
                <!-- Status Badge -->
                <div class="absolute top-6 right-6 flex items-center gap-1.5 px-2.5 py-1 bg-tertiary/10 border border-tertiary/20 rounded-full">
                    <span class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                    <span class="text-[10px] font-bold text-tertiary uppercase tracking-wider">Active</span>
                </div>

                <div class="flex items-center gap-4 mb-6">
                    <div class="w-14 h-14 rounded-lg overflow-hidden bg-surface-container-high border border-outline-variant/50 flex-shrink-0">
                        <img class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdzGLJ0OfLNEylOJDudA6QG8FOYfl1hPs6tzqbrtSSH9d6u60f9Tx8xHX1OVSyGt9EhkhUBNZ2fz5b_fqc6DWuYgDVdEFwcaHkbWA44uYMdBJ0qQITHrvaIpS0tNF1MY_WXXiQ6kg78yteMskw27gDfNkehmAjGDM4ArGfE-VHEPkxgHHB_UzZSHN-ESrdrykf1Hi7ZGh7PLLX9UowE37hEKrakN000PFjj-k86_yEj-k9f1LvMkSDUNTOJjnV2EFiCqNjJLnE7EQ" alt="Workspace Logo">
                    </div>
                    <div>
                        <h2 class="font-headline-md text-xl font-bold text-on-surface group-hover:text-primary transition-colors">Đại Ngàn Coffee</h2>
                        <p class="font-code text-xs text-on-surface-variant/70 mt-1">daingan.atlassian.net</p>
                    </div>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-2 gap-4 mt-auto pt-6 border-t border-outline-variant/30">
                    <div>
                        <p class="font-label-md text-xs text-on-surface-variant mb-1">Synced Projects</p>
                        <p class="font-headline-md text-lg text-on-surface">4</p>
                    </div>
                    <div>
                        <p class="font-label-md text-xs text-on-surface-variant mb-1">Avg Pass Rate</p>
                        <p class="font-headline-md text-lg text-tertiary">94%</p>
                    </div>
                </div>
            </a>

            <!-- Card 2: Another Workspace (Offline) -->
            <a href="#" class="bg-surface-container-low rounded-xl p-6 cyber-border-glow cursor-pointer group flex flex-col h-full relative overflow-hidden">
                <div class="absolute top-6 right-6 flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-high border border-outline-variant/30 rounded-full">
                    <span class="w-2 h-2 rounded-full bg-on-surface-variant"></span>
                    <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Offline</span>
                </div>

                <div class="flex items-center gap-4 mb-6">
                    <div class="w-14 h-14 rounded-lg bg-surface-container-high border border-outline-variant/50 flex items-center justify-center flex-shrink-0">
                        <span class="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-primary transition-colors">domain</span>
                    </div>
                    <div>
                        <h2 class="font-headline-md text-xl font-bold text-on-surface group-hover:text-primary transition-colors">Acme Corp IT</h2>
                        <p class="font-code text-xs text-on-surface-variant/70 mt-1">acme-it.atlassian.net</p>
                    </div>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-2 gap-4 mt-auto pt-6 border-t border-outline-variant/30">
                    <div>
                        <p class="font-label-md text-xs text-on-surface-variant mb-1">Synced Projects</p>
                        <p class="font-headline-md text-lg text-on-surface">1</p>
                    </div>
                    <div>
                        <p class="font-label-md text-xs text-on-surface-variant mb-1">Avg Pass Rate</p>
                        <p class="font-headline-md text-lg text-on-surface">--</p>
                    </div>
                </div>
            </a>

        </div>
    </div>
</main>

</body>
</html>
