import { multiply } from "../../src/services/multplication-service";

test("constructor sets message and author given valid body", () => {
    const actual = multiply(1, 2)

    expect(actual).toBe(2);
});
