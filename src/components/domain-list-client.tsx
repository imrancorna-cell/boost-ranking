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
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from './ui/card';

type SortableDomain = WithId<Domain>;

type SortConfig = {
  key: keyof SortableDomain;
  direction: 'ascending' | 'descending';
} | null;

export function DomainListClient({ domains }: { domains: WithId<Domain>[] }) {
  const [filter, setFilter] = useState('');
  const [daFilter, setDaFilter] = useState('');
  const [drFilter, setDrFilter] = useState('');
  const [tfFilter, setTfFilter] = useState('');
  const [ssFilter, setSsFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
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
    const daValue = daFilter ? parseInt(daFilter, 10) : null;
    const drValue = drFilter ? parseInt(drFilter, 10) : null;
    const tfValue = tfFilter ? parseInt(tfFilter, 10) : null;
    const ssValue = ssFilter ? parseInt(ssFilter, 10) : null;

    return domains.filter((domain) => {
      const searchTerm = filter.toLowerCase();
      const tld = getTld(domain.url);

      const urlMatch = filter
        ? domain.url.toLowerCase().includes(searchTerm) ||
          (tld && tld.includes(searchTerm))
        : true;

      const daMatch =
        daValue === null || isNaN(daValue) ? true : domain.da === daValue;
      const drMatch =
        drValue === null || isNaN(drValue) ? true : domain.dr === drValue;
      const tfMatch =
        tfValue === null || isNaN(tfValue) ? true : domain.tf === tfValue;
      const ssMatch =
        ssValue === null || isNaN(ssValue) ? true : domain.ss === ssValue;

      if (daFilter && isNaN(daValue)) return false;
      if (drFilter && isNaN(drValue)) return false;
      if (tfFilter && isNaN(tfValue)) return false;
      if (ssFilter && isNaN(ssValue)) return false;

      return urlMatch && daMatch && drMatch && tfMatch && ssMatch;
    });
  }, [domains, filter, daFilter, drFilter, tfFilter, ssFilter]);

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
  };

  type ColumnKeys = keyof typeof visibleColumns;

  const columnConfig: {
    id: ColumnKeys;
    label: string;
    sortKey: keyof SortableDomain;
  }[] = [
    { id: 'url', label: 'URL', sortKey: 'url' },
    { id: 'da', label: 'DA', sortKey: 'da' },
    { id: 'dr', label: 'DR', sortKey: 'dr' },
    { id: 'tf', label: 'TF', sortKey: 'tf' },
    { id: 'ss', label: 'Spam', sortKey: 'ss' },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center gap-4 pb-4">
          <Input
            placeholder="Filter by URL or TLD..."
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
            className="max-w-sm"
          />
          <Input
            type="number"
            placeholder="DA"
            value={daFilter}
            onChange={(e) => setDaFilter(e.target.value)}
            className="w-20"
          />
          <Input
            type="number"
            placeholder="DR"
            value={drFilter}
            onChange={(e) => setDrFilter(e.target.value)}
            className="w-20"
          />
          <Input
            type="number"
            placeholder="TF"
            value={tfFilter}
            onChange={(e) => setTfFilter(e.target.value)}
            className="w-20"
          />
          <Input
            type="number"
            placeholder="Spam"
            value={ssFilter}
            onChange={(e) => setSsFilter(e.target.value)}
            className="w-20"
          />
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
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
                      setVisibleColumns((prev) => ({
                        ...prev,
                        [column.id]: !!value,
                      }))
                    }
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columnConfig
                  .filter((c) => visibleColumns[c.id])
                  .map((column) => (
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
              {sortedDomains.length > 0 ? (
                sortedDomains.map((domain) => (
                  <TableRow key={domain.id}>
                    {visibleColumns.url && (
                      <TableCell className="font-medium">{domain.url}</TableCell>
                    )}
                    {visibleColumns.da && <TableCell>{domain.da}</TableCell>}
                    {visibleColumns.dr && <TableCell>{domain.dr}</TableCell>}
                    {visibleColumns.tf && <TableCell>{domain.tf}</TableCell>}
                    {visibleColumns.ss && <TableCell>{domain.ss}%</TableCell>}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={Object.values(visibleColumns).filter(Boolean).length}
                    className="h-24 text-center"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
