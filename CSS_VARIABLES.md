# CSS Variables Naming Convention

This document outlines the consistent CSS variable naming convention used throughout the project.

## Naming Pattern

All CSS variables follow the pattern: `--{category}-{property}[-{variant}]`

## Categories

### Colors
All color variables are prefixed with `--color-`:

#### Primary Colors
- `--color-primary` - Main brand color
- `--color-primary-hover` - Primary color on hover
- `--color-primary-dark` - Darker variant of primary color
- `--color-secondary` - Secondary brand color

#### Text Colors
- `--color-text` - Main text color
- `--color-text-light` - Light text color (secondary text)
- `--color-text-muted` - Muted text color (disabled/placeholder)

#### Background Colors
- `--color-background` - Main background color
- `--color-background-alt` - Alternative background color
- `--color-background-elevated` - Elevated surfaces (cards, modals)

#### Border Colors
- `--color-border` - Main border color
- `--color-border-light` - Light border color

#### State Colors
- `--color-success` - Success state color
- `--color-warning` - Warning state color
- `--color-error` - Error state color  
- `--color-info` - Information state color

#### Interactive Colors
- `--color-hover-bg` - Background color on hover
- `--color-focus-ring` - Focus ring color

### Typography
Font-related variables are prefixed with `--font-`:

- `--font-family-primary` - Main font family
- `--font-size-base` - Base font size (16px)
- `--font-size-small` - Small text (14px)
- `--font-size-large` - Large text (18px)
- `--font-size-xl` - Extra large (24px)
- `--font-size-xxl` - Extra extra large (32px)

### Spacing
Spacing variables are prefixed with `--spacing-`:

- `--spacing-xs` - Extra small (4px)
- `--spacing-sm` - Small (8px)
- `--spacing-md` - Medium (16px)
- `--spacing-lg` - Large (24px)
- `--spacing-xl` - Extra large (32px)
- `--spacing-xxl` - Extra extra large (48px)

### Layout
Layout-related variables:

- `--border-radius` - Default border radius (8px)
- `--border-radius-sm` - Small border radius (4px)
- `--border-radius-lg` - Large border radius (12px)

### Animations
Animation variables are prefixed with `--transition-`:

- `--transition-fast` - Fast transition (0.15s ease)
- `--transition-normal` - Normal transition (0.3s ease)
- `--transition-slow` - Slow transition (0.5s ease)

### Shadows
Shadow variables for depth:

- `--shadow-sm` - Small shadow
- `--shadow-md` - Medium shadow  
- `--shadow-lg` - Large shadow

### Gradients
Gradient variables:

- `--gradient-primary` - Primary gradient
- `--gradient-secondary` - Secondary gradient

## Theme Implementation

Variables are defined within theme selectors:

```scss
[data-theme="light"] {
  --color-primary: #0070f3;
  --color-text: #1a1a1a;
  --color-background: #ffffff;
  // ... other light theme variables
}

[data-theme="dark"] {
  --color-primary: #3b82f6;
  --color-text: #f9fafb;
  --color-background: #0f172a;
  // ... other dark theme variables
}
```

## Usage Examples

```scss
.button {
  background-color: var(--color-primary);
  color: var(--color-text);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: var(--color-primary-hover);
  }
  
  &:focus {
    box-shadow: 0 0 0 3px var(--color-focus-ring);
  }
}
```

## Benefits

1. **Consistency**: All variables follow the same naming pattern
2. **Clarity**: Variable purpose is immediately clear from the name
3. **Maintainability**: Easy to find and update related variables
4. **Theme Support**: Automatic theme switching with proper variable scoping
5. **IDE Support**: Better autocomplete with consistent prefixes
6. **Future-proof**: Easy to add new categories and variants

## Migration Notes

The following old variables were renamed:

- `--primary-color` → `--color-primary`
- `--text-color` → `--color-text`  
- `--background-color` → `--color-background`
- `--border-color` → `--color-border`
- `--hover-bg` → `--color-hover-bg`
- `--focus-ring` → `--color-focus-ring`
- `--success-color` → `--color-success`
- etc.

All component SCSS files have been updated to use the new naming convention.