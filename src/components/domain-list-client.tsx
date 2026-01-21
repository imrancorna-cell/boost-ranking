'use client';

import type { Domain } from '@/lib/definitions';
import type { WithId } from '@/firebase';
import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowUpDown,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PaginationControls } from './pagination-controls';
import { Card, CardContent } from './ui/card';

type SortableDomain = WithId<Domain>;

type SortConfig = {
  key: keyof SortableDomain;
  direction: 'ascending' | 'descending';
} | null;

const ITEMS_PER_PAGE = 10;

export function DomainListClient({ domains }: { domains: WithId<Domain>[] }) {
  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState({
    url: true,
    da: true,
    dr: true,
    tf: true,
    ss: true,
  });

  const getTld = (url: string) => {
    try {
      const parts = url.split('.');
      return parts.length > 1 ? parts.pop() : '';
    } catch {
      return '';
    }
  };

  const filteredDomains = useMemo(() => {
    return domains.filter((domain) => {
      const searchTerm = filter.toLowerCase();
      const tld = getTld(domain.url);
      return domain.url.toLowerCase().includes(searchTerm) || (tld && tld.includes(searchTerm));
    });
  }, [domains, filter]);
  

  const sortedDomains = useMemo(() => {
    let sortableItems = [...filteredDomains];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredDomains, sortConfig]);

  const paginatedDomains = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedDomains.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedDomains, currentPage]);

  const requestSort = (key: keyof SortableDomain) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(sortedDomains.length / ITEMS_PER_PAGE);

  type ColumnKeys = keyof typeof visibleColumns;

  const columnConfig: { id: ColumnKeys, label: string, sortKey: keyof SortableDomain }[] = [
    { id: 'url', label: 'URL', sortKey: 'url' },
    { id: 'da', label: 'DA', sortKey: 'da' },
    { id: 'dr', label: 'DR', sortKey: 'dr' },
    { id: 'tf', label: 'TF', sortKey: 'tf' },
    { id: 'ss', label: 'Spam', sortKey: 'ss' },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between pb-4">
          <Input
            placeholder="Filter by URL or TLD..."
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {columnConfig.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={visibleColumns[column.id]}
                  onCheckedChange={(value) =>
                    setVisibleColumns((prev) => ({ ...prev, [column.id]: !!value }))
                  }
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columnConfig.filter(c => visibleColumns[c.id]).map((column) => (
                   <TableHead key={column.id}>
                   <Button
                     variant="ghost"
                     onClick={() => requestSort(column.sortKey)}
                   >
                     {column.label}
                     <ArrowUpDown className="ml-2 h-4 w-4" />
                   </Button>
                 </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDomains.length > 0 ? (
                paginatedDomains.map((domain) => (
                  <TableRow key={domain.id}>
                    {visibleColumns.url && <TableCell className="font-medium">{domain.url}</TableCell>}
                    {visibleColumns.da && <TableCell>{domain.da}</TableCell>}
                    {visibleColumns.dr && <TableCell>{domain.dr}</TableCell>}
                    {visibleColumns.tf && <TableCell>{domain.tf}</TableCell>}
                    {visibleColumns.ss && <TableCell>{domain.ss}%</TableCell>}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="pt-4">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </CardContent>
    </Card>
  );
}
