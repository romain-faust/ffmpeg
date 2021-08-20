const MS_IN_SECOND = 1000
const MS_IN_MINUTE = 60 * MS_IN_SECOND
const MS_IN_HOUR = 60 * MS_IN_MINUTE

interface ToMsOptions {
	readonly hours: number
	readonly milliseconds: number
	readonly minutes: number
	readonly seconds: number
}

export function toMs({
	hours,
	milliseconds,
	minutes,
	seconds,
}: ToMsOptions): number {
	return (
		hours * MS_IN_HOUR +
		minutes * MS_IN_MINUTE +
		seconds * MS_IN_SECOND +
		milliseconds
	)
}
