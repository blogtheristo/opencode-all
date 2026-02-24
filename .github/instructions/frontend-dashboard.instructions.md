---
applyTo: "dws6.com/dashboard/**/*.{tsx,jsx,ts,js}"
---

# Frontend Dashboard Instructions (React + Vite)

## Component Structure

**Use functional components with TypeScript:**

```tsx
import { useState, useEffect } from 'react';
import { z } from 'zod';

// Define props schema
const UserProfileSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'user'])
});

type UserProfileProps = z.infer<typeof UserProfileSchema>;

export function UserProfile({ name, email, role }: UserProfileProps) {
  const [loading, setLoading] = useState(false);
  
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="text-gray-600 dark:text-gray-400">{email}</p>
    </div>
  );
}
```

## Styling with TailwindCSS

**ALWAYS use Tailwind classes, never inline styles or CSS-in-JS:**

```tsx
// ✅ CORRECT - Tailwind classes
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
  Submit
</button>

// ❌ WRONG - Inline styles
<button style={{ padding: '8px 16px', backgroundColor: 'blue' }}>
  Submit
</button>
```

**Dark mode support:** Use `dark:` prefix for dark mode variants:

```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content adapts to theme
</div>
```

## Form Validation with Zod

**ALWAYS validate forms with Zod before submission:**

```tsx
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

function LoginForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    // Validate
    const result = LoginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password')
    });
    
    if (!result.success) {
      console.error(result.error.errors);
      return;
    }
    
    // Safe to use result.data
    submitLogin(result.data);
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Supabase Integration

**Use Supabase client for backend calls:**

```tsx
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Query data
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('status', 'active');

if (error) {
  console.error('Supabase query failed:', error);
  return;
}

// Use data safely (TypeScript will infer type)
```

## Development Workflow

**When working on dashboard:**

```bash
# Navigate to dashboard directory
cd dws6.com/dashboard/firehorse/v9-react/

# Install dependencies (if not done)
npm install

# Start dev server (hot reload on port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Common Issues

### Issue: Environment variables undefined
**Cause:** Missing `VITE_` prefix  
**Fix:** Vite requires `VITE_` prefix for env vars:

```bash
# .env file
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_API_URL=https://api.dws6.com
```

### Issue: Tailwind classes not working
**Cause:** Class not in content paths in `tailwind.config.js`  
**Fix:** Verify content paths include your component files:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
}
```

### Issue: Dark mode not working
**Cause:** Missing dark mode class on root element  
**Fix:** Ensure `<html class="dark">` or use system preference detection
