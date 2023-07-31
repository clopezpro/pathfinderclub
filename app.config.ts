export default defineAppConfig({
  ui: {
    table: {
      base: 'min-w-full table-fixed border border-gray-200 dark:border-gray-700',
      divide: 'divide-y divide-gray-200 dark:divide-gray-700',
      tbody: 'divide-y divide-gray-200 dark:divide-gray-700',
      tr: {
        base: 'divide-x  divide-gray-200 dark:divide-gray-700',
      },
    },
    input: {
      color: {
        gray: {
          outline: 'shadow-sm bg-gray-50 dark:bg-muted-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
        },
      },
    },
  },
})
