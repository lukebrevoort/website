# Project Sidebar Component

## Overview

The `ProjectSidebar` component is a reusable, customizable sidebar designed for project pages. It provides a glassmorphism design with smooth animations and supports different color schemes for each project.

## Features

- **Glassmorphism Design**: Beautiful translucent sidebar with blur effects
- **Customizable Colors**: Each project can have its own primary and secondary colors
- **Custom Logo**: Support for project-specific logos
- **Responsive**: Works on both desktop and mobile devices
- **Smooth Animations**: Expand/collapse animations and fade-in effects
- **Shimmer Effects**: Subtle shimmer animations for enhanced visual appeal

## Usage

```tsx
import ProjectSidebar from '@/components/project-sidebar'
import { getProjectBySlug } from '@/data/projects'

export default function YourProjectPage() {
  const [activeItem, setActiveItem] = useState('#overview')
  
  const project = getProjectBySlug('your-project-slug')
  
  const navigation = [
    { name: 'Overview', href: '#overview' },
    { name: 'Features', href: '#features' },
    // ... more navigation items
  ]

  const handleItemClick = (href: string) => {
    setActiveItem(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectSidebar
        projectName={project.title}
        projectLogo={project.logo}
        primaryColor={project.primaryColor}
        secondaryColor={project.secondaryColor}
        navigation={navigation}
        activeItem={activeItem}
        onItemClick={handleItemClick}
      >
        {/* Your page content goes here */}
        <main className="py-10">
          {/* ... */}
        </main>
      </ProjectSidebar>
    </div>
  )
}
```

## Project Data Structure

Each project in your data should include the following properties for sidebar customization:

```typescript
interface Project {
  // ... other properties
  logo: string           // Path to project logo image
  primaryColor: string   // Primary color (hex format)
  secondaryColor: string // Secondary color (hex format)
}
```

## Color Examples

Here are the current project color schemes:

- **FlowState**: Primary `#d06224` (orange), Secondary `#9eab57` (green)
- **Personal Website**: Primary `#3b82f6` (blue), Secondary `#8b5cf6` (purple)
- **Calculator**: Primary `#0f172a` (dark slate), Secondary `#64748b` (slate)
- **Sentiment Analysis**: Primary `#dc2626` (red), Secondary `#ea580c` (orange)
- **HFTC**: Primary `#059669` (emerald), Secondary `#0891b2` (cyan)
- **Job Personalizer**: Primary `#7c3aed` (violet), Secondary `#ec4899` (pink)
- **Assignment Tracker**: Primary `#6366f1` (indigo), Secondary `#8b5cf6` (violet)

## Component Props

| Prop | Type | Description |
|------|------|-------------|
| `projectName` | string | Display name of the project |
| `projectLogo` | string | Path to the project logo image |
| `primaryColor` | string | Primary color for the gradient (hex) |
| `secondaryColor` | string | Secondary color for the gradient (hex) |
| `navigation` | Array | Navigation items with name and href |
| `activeItem` | string | Currently active navigation item |
| `onItemClick` | function | Callback when navigation item is clicked |
| `children` | ReactNode | Page content to render inside the sidebar layout |

## Animations

The component includes several built-in animations:
- Sidebar expand/collapse on hover (desktop)
- Fade-in animations for navigation items
- Shimmer effect overlay
- Smooth color transitions

## Mobile Support

The sidebar automatically adapts to mobile devices with:
- Overlay modal on mobile
- Touch-friendly navigation
- Hamburger menu toggle
- Swipe-to-close functionality
