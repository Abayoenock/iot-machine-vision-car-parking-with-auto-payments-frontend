"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Clock, Coins, Trash2, Loader2 } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import { useQueryClient } from "react-query"

type ParkingFee = {
  fees_id?: number
  duration_from: number
  duration_to: number | undefined
  fee: number
}

const schema = z.object({
  duration_from: z.coerce.number().min(0),
  duration_to: z.coerce.number().nullable(),
  fee: z.coerce.number().min(0),
})

export default function ParkingFeeSettings({ fees }: { fees: ParkingFee[] }) {
  const [error, setError] = useState<string | null>(null)
  const [loadingAdd, setLoadingAdd] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null)

  const queryClient = useQueryClient()
  const form = useForm<ParkingFee>({
    resolver: zodResolver(schema),
    defaultValues: {
      duration_from: 0,
      duration_to: undefined,
      fee: 0,
    },
  })

  // ✅ Overlap check
  const isOverlapping = (newRule: ParkingFee): boolean => {
    return fees.some((f) => {
      const fromA = f.duration_from
      const toA = f.duration_to ?? Infinity
      const fromB = newRule.duration_from
      const toB = newRule.duration_to ?? Infinity

      return Math.max(fromA, fromB) < Math.min(toA, toB) // overlap condition
    })
  }

  const onSubmit = async (data: ParkingFee) => {
    setError(null)

    if (isOverlapping(data)) {
      setError("This rule overlaps with an existing one. Please adjust ranges.")
      toast.error("Failed to add fee rule: Overlapping ranges")
      return
    }

    setLoadingAdd(true)
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/api/settings/fees`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("JWT_TOKEN")}`,
          },
        }
      )
      form.reset()
      toast.success("Fee rule added")
      queryClient.invalidateQueries("/api/settings")
    } catch (err) {
      console.log(err)
      toast.error("Failed to add fee rule")
    } finally {
      setLoadingAdd(false)
    }
  }

  const deleteRule = async (id?: number) => {
    if (!id) return
    setLoadingDelete(id)
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/api/settings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("JWT_TOKEN")}`,
          },
        }
      )
      toast.success("Fee rule deleted")
      queryClient.invalidateQueries("/api/settings")
    } catch (err) {
      console.log(err)
      toast.error("Failed to delete rule")
    } finally {
      setLoadingDelete(null)
    }
  }

  return (
    <div className="px-6 h-fit grid gap-6">
      <Card className="shadow-lg rounded-2xl border">
        <CardHeader>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Coins className="w-5 h-5 text-blue-600" /> Parking Fee Rules
          </h2>
          <p className="text-sm text-gray-500">
            Define interval-based pricing when <b>Only Time Spent</b> is OFF.
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="text-red-500 text-sm border border-red-200 bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Duration From */}
                <FormField
                  control={form.control}
                  name="duration_from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> From (hrs)
                      </FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Duration To */}
                <FormField
                  control={form.control}
                  name="duration_to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> To (hrs)
                      </FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="∞" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Fee */}
                <FormField
                  control={form.control}
                  name="fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Coins className="w-4 h-4" /> Fee (Rwf)
                      </FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={loadingAdd}
              >
                {loadingAdd && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save Fee Rule
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {fees.length > 0 && (
        <Card className="shadow rounded-2xl py-4">
          <CardContent>
            <h3 className="font-semibold mb-3">Existing Rules</h3>
            <div className="overflow-hidden border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-3 py-2 text-left">From (hrs)</th>
                    <th className="px-3 py-2 text-left">To (hrs)</th>
                    <th className="px-3 py-2 text-left">Fee (Rwf)</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((f) => (
                    <tr key={f.fees_id} className="border-t hover:bg-gray-50">
                      <td className="px-3 py-2">{f.duration_from}</td>
                      <td className="px-3 py-2">{f.duration_to ?? "∞"}</td>
                      <td className="px-3 py-2">{f.fee}</td>
                      <td className="px-3 py-2 text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={loadingDelete === f.fees_id}
                            >
                              {loadingDelete === f.fees_id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                              ) : (
                                <Trash2 className="w-4 h-4 text-red-600" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirm Deletion
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this fee rule?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteRule(f.fees_id)}
                                className="bg-red-600 text-white hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
