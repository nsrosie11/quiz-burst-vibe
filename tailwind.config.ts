import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				mejakia: {
					primary: 'hsl(var(--mejakia-primary))',
					'primary-dark': 'hsl(var(--mejakia-primary-dark))',
					shadow: 'hsl(var(--mejakia-shadow))',
					'shadow-hover': 'hsl(var(--mejakia-shadow-hover))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			backgroundImage: {
				'mejakia-gradient': 'var(--mejakia-gradient)',
				'mejakia-gradient-hover': 'var(--mejakia-gradient-hover)',
				'profile-gradient': 'var(--profile-gradient)',
				'profile-gradient-hover': 'var(--profile-gradient-hover)',
				'recommendation-button': 'var(--recommendation-button)',
				'gray-gradient': 'var(--gray-gradient)',
				'back-button': 'linear-gradient(#1073B6, #0B599C)',
				'input-focus': 'linear-gradient(135deg, #1073B6, #0B599C)',
				'input-gradient': 'linear-gradient(135deg, #1073B6, #0B599C)'
			},
			boxShadow: {
				'mejakia': 'var(--shadow-mejakia)',
				'mejakia-hover': 'var(--shadow-mejakia-hover)',
				'profile': 'var(--shadow-profile)',
				'profile-hover': 'var(--shadow-profile-hover)',
				'recommendation': 'var(--shadow-recommendation)',
				'input': 'var(--input-shadow)',
				'input-focus': 'var(--input-shadow-focus)',
				'back-button': '0 4px 0 #084383',
				'input-focus-custom': '0 4px 0 #23587F'
			},
			fontFamily: {
				'fredoka': ['Fredoka', 'cursive'],
				'nunito': ['Nunito', 'sans-serif']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
