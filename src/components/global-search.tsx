'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { globalSearchAction, type SearchResult } from '@/app/dashboard/search-actions'
import { useDebounce } from '@/hooks/use-debounce'

export function GlobalSearch() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  React.useEffect(() => {
    async function search() {
      if (!debouncedQuery.trim()) {
        setResults([])
        return
      }
      setLoading(true)
      try {
        const res = await globalSearchAction(debouncedQuery)
        setResults(res)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    search()
  }, [debouncedQuery])

  const handleSelect = (url: string) => {
    setOpen(false)
    router.push(url)
  }

  const groupedResults = results.reduce((acc, result) => {
    const group = acc[result.type] || []
    group.push(result)
    acc[result.type] = group
    return acc
  }, {} as Record<string, SearchResult[]>)

  const typeLabels: Record<string, string> = {
    lead: 'Leads',
    client: 'Clients',
    project: 'Projects',
    task: 'Tasks',
    team: 'Team Members',
    file: 'Files'
  }

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-64 lg:w-80"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search AgencyOS...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.45rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Type a command or search..." 
          value={query} 
          onValueChange={setQuery} 
        />
        <CommandList>
          {loading && <div className="p-4 text-sm text-center text-muted-foreground">Searching...</div>}
          {!loading && query && results.length === 0 && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
          {!loading && Object.keys(groupedResults).map(type => (
            <CommandGroup key={type} heading={typeLabels[type] || type}>
              {groupedResults[type].map(result => (
                <CommandItem
                  key={result.id}
                  value={`${result.type}-${result.title}-${result.id}`}
                  onSelect={() => handleSelect(result.url)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{result.title}</span>
                    {result.subtitle && (
                      <span className="text-xs text-muted-foreground">{result.subtitle}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
