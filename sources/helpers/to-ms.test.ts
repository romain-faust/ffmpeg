import { toMs } from './to-ms'

describe('toMs()', () => {
	it('should return the expected number of milliseconds', () => {
		const milliseconds = 1000
		const seconds = 10
		const minutes = 30
		const hours = 5

		const actual = toMs({ hours, milliseconds, minutes, seconds })
		const expected = 19_811_000

		expect(actual).toBe(expected)
	})
})
