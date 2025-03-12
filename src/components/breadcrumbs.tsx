import React from 'react'
import Link from 'next/link'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


export interface BreadcrumbItem {
    label: string
    href: string
    separator: boolean
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <div className="inline-flex p-2">
            <Breadcrumb>
                <BreadcrumbList>
                    {items.map((item, index) => (
                        <React.Fragment key={index}>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={item.href}>{item.label}</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {item.separator ? <BreadcrumbSeparator /> : null}
                        </React.Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
}
