import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: true, // Include User if exists
            orderItems: {
                include: { product: true }
            }
        }
    });

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Pesanan</h1>

            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Order ID</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Pelanggan</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Total</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Tanggal</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Detail</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono text-xs font-medium text-gray-600">
                                    {order.orderId}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-sm text-gray-800">
                                        {order.customerName || order.user?.name || "Guest"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {order.userId ? <span className="text-blue-600 font-semibold">[Member]</span> : <span className="text-orange-500 font-semibold">[Guest]</span>}
                                        <span className="ml-1">{order.customerEmail}</span>
                                    </div>
                                    {order.shippingAddress && (
                                        <div className="text-[10px] text-gray-400 mt-1 max-w-xs truncate">
                                            {order.shippingAddress}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 font-bold text-sm text-[#b48d5e]">
                                    Rp {order.totalAmount.toLocaleString("id-ID")}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full border ${order.status === 'PAID' ? 'bg-green-50 text-green-600 border-green-100' :
                                            order.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                                'bg-red-50 text-red-600 border-red-100'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString("id-ID")}
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-500">
                                    <ul className="list-disc pl-4">
                                        {order.orderItems.map(item => (
                                            <li key={item.id}>
                                                {item.product.name} (x{item.quantity})
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && (
                    <div className="p-8 text-center text-gray-500">Belum ada pesanan.</div>
                )}
            </div>
        </div>
    );
}
