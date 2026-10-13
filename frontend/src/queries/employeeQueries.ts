export const employeeKeys = {
  all: ["employees"] as const,
  detail: (employeeId: string) => ["employees", employeeId] as const,
}
