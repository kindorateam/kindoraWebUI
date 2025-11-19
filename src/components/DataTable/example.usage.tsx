import { Avatar } from "@heroui/react"
import { useQuery } from "@tanstack/react-query"

import DataTable from "@/components/DataTable"

import type { TableColumn } from "@/types/table"

// Example 1: User table
interface User {
	id: string
	name: string
	email: string
	status: "active" | "inactive"
	lastLogin: Date
}

const userColumns: TableColumn<User>[] = [
	{
		key: "name",
		label: "Name",
		renderCell: (user) => (
			<div className="flex items-center gap-2">
				<Avatar name={user.name} size="sm" />
				<span>{user.name}</span>
			</div>
		),
	},
	{
		key: "email",
		label: "Email",
	},
	{
		key: "status",
		label: "Status",
		renderCell: (user) => (
			<span className={user.status === "active" ? "text-green-500" : "text-red-500"}>{user.status}</span>
		),
	},
	{
		key: "lastLogin",
		label: "Last Login",
		renderCell: (user) => new Date(user.lastLogin).toLocaleDateString(),
	},
]

export const UserTable = () => {
	const { data: users = [], isLoading } = useQuery({
		queryKey: ["users"],
		queryFn: (): Promise<User[]> => {
			// Your API call here
			return Promise.resolve([])
		},
	})

	return (
		<DataTable<User>
			columns={userColumns}
			data={users}
			emptyMessage="No users found"
			getRowKey={(user) => user.id}
			isLoading={isLoading}
		/>
	)
}

// Example 2: Product table
interface Product {
	sku: string
	name: string
	price: number
	stock: number
	category: string
}

const productColumns: TableColumn<Product>[] = [
	{
		key: "sku",
		label: "SKU",
	},
	{
		key: "name",
		label: "Product Name",
	},
	{
		key: "category",
		label: "Category",
	},
	{
		key: "price",
		label: "Price",
		align: "end",
		renderCell: (product) => `$${product.price.toFixed(2)}`,
	},
	{
		key: "stock",
		label: "Stock",
		align: "end",
		renderCell: (product) => (
			<span className={product.stock < 10 ? "font-bold text-red-500" : ""}>{product.stock}</span>
		),
	},
]

export const ProductTable = () => {
	const { data: products = [], isLoading } = useQuery({
		queryKey: ["products"],
		queryFn: (): Promise<Product[]> => {
			// Your API call here
			return Promise.resolve([])
		},
	})

	return (
		<DataTable<Product>
			columns={productColumns}
			data={products}
			emptyMessage="No products in inventory"
			getRowKey={(product) => product.sku}
			isLoading={isLoading}

		/>
	)
}

// Example 3: Simple table without custom rendering
interface Order {
	orderId: string
	customerName: string
	total: number
	status: string
	date: string
}

const orderColumns: TableColumn<Order>[] = [
	{ key: "orderId", label: "Order ID" },
	{ key: "customerName", label: "Customer" },
	{ key: "total", label: "Total", align: "end" },
	{ key: "status", label: "Status" },
	{ key: "date", label: "Date" },
]

export const OrderTable = () => {
	const { data: orders = [], isLoading } = useQuery({
		queryKey: ["orders"],
		queryFn: (): Promise<Order[]> => {
			// Your API call here
			return Promise.resolve([])
		},
	})

	return (
		<DataTable<Order>
			columns={orderColumns}
			data={orders}
			emptyMessage="No orders yet"
			getRowKey={(order) => order.orderId}
			isLoading={isLoading}
		/>
	)
}
