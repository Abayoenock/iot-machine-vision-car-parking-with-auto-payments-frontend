import React from "react"
import { useLocation, Link } from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const generateBreadcrumbs = (pathname: any) => {
  const pathnames = pathname.split("/").filter((x: any) => x)
  const breadcrumbs = pathnames.map((value: any, index: any) => {
    const to = `/${pathnames.slice(0, index + 1).join("/")}`
    return {
      label: value.charAt(0).toUpperCase() + value.slice(1),
      to: to,
    }
  })
  breadcrumbs[0].to = `${breadcrumbs[0].to}/`

  return [
    // Ensure home is always the first breadcrumb
    ...breadcrumbs,
  ]
}

const BreadCrumb = () => {
  const location = useLocation()
  const breadcrumbs = generateBreadcrumbs(location.pathname)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.to}>
            <BreadcrumbItem>
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
              ) : (
                <Link to={breadcrumb.to}>{breadcrumb.label}</Link>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default BreadCrumb
