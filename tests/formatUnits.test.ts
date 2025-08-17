import { expect, test } from "bun:test";
import { KformatUnits as formatUnits } from "../src/index";

test("formatUnits", () => {
    // Zero and small values
    expect(formatUnits(0n, 8)).toBe("0");
    expect(formatUnits(0n, 8, 4)).toBe("0");
    expect(formatUnits(5n, 3)).toBe("0.005");
    expect(formatUnits(500n, 3)).toBe("0.5");

    // decimals = 0 (integer only)
    expect(formatUnits(1234n, 0)).toBe("1234");
    expect(formatUnits(1234n, 0, 2)).toBe("1234");

    // exact values & trailing-zero removal
    expect(formatUnits(100000n, 4)).toBe("10");
    expect(formatUnits(100200n, 4)).toBe("10.02");

    // default precision == decimals
    expect(formatUnits(123456n, 3)).toBe("123.456");
    expect(formatUnits(123450n, 3)).toBe("123.45");

    // Rounding up at ½
    expect(formatUnits(15n, 1, 0)).toBe("1"); // 1.5 → 1
    expect(formatUnits(25n, 1, 0)).toBe("2"); // 2.5 → 2
    expect(formatUnits(125n, 2, 1)).toBe("1.2"); // 1.25 → 1.2

    // Rounding down just below ½
    expect(formatUnits(14n, 1, 0)).toBe("1"); // 1.4 → 1
    expect(formatUnits(124n, 2, 1)).toBe("1.2"); // 1.24 → 1.2

    // Negative values & rounding
    expect(formatUnits(-1005n, 2)).toBe("-10.05");
    expect(formatUnits(-1005n, 2, 1)).toBe("-10.1");
    expect(formatUnits(-15n, 1, 0)).toBe("-2");
    expect(formatUnits(-14n, 1, 0)).toBe("-2");

    // Typical “18 decimals” (e.g. ETH)
    expect(formatUnits(1n, 18)).toBe("0.000000000000000001");
    expect(formatUnits(1000000000000000000n, 18)).toBe("1");
    expect(formatUnits(1234500000000000000n, 18, 5)).toBe("1.2345");

    // maxPrecision > decimals (should just use decimals)
    expect(formatUnits(12345n, 3, 5)).toBe("12.345");
    expect(formatUnits(1234500n, 3, 5)).toBe("1234.5");

    // Large BigInt + custom precision
    expect(formatUnits(9876543210987654321n, 18, 8)).toBe("9.87654321");

    // Really small fractional rounding
    expect(formatUnits(999n, 6, 4)).toBe("0.0009");

    // Mixed significant figures + rounding
    // 1234005 / 1e4 = 123.4005 → to 3 digits: 123.400₅ → → 123.401
    expect(formatUnits(1234005n, 4, 3)).toBe("123.4");

    expect(formatUnits(69n, 0)).toMatchInlineSnapshot('"69"');
    expect(formatUnits(69n, 5)).toMatchInlineSnapshot('"0.00069"');
    expect(formatUnits(690n, 1)).toMatchInlineSnapshot('"69"');
    expect(formatUnits(1300000n, 5)).toMatchInlineSnapshot('"13"');
    expect(formatUnits(4200000000000n, 10)).toMatchInlineSnapshot('"420"');
    expect(formatUnits(20000000000n, 9)).toMatchInlineSnapshot('"20"');
    expect(formatUnits(40000000000000000000n, 18)).toMatchInlineSnapshot(
        '"40"'
    );
    expect(formatUnits(10000000000000n, 18)).toMatchInlineSnapshot('"0.00001"');
    expect(formatUnits(12345n, 4)).toMatchInlineSnapshot('"1.2345"');
    expect(formatUnits(12345n, 4)).toMatchInlineSnapshot('"1.2345"');
    expect(
        formatUnits(6942069420123456789123450000n, 18)
    ).toMatchInlineSnapshot('"6942069420.12345678912345"');
    expect(
        formatUnits(
            694212312312306942012345444446789123450000000000000000000000000000000n,
            50
        )
    ).toMatchInlineSnapshot('"6942123123123069420.1234544444678912345"');
    expect(formatUnits(-690n, 1)).toMatchInlineSnapshot('"-69"');
    expect(formatUnits(-1300000n, 5)).toMatchInlineSnapshot('"-13"');
    expect(formatUnits(-4200000000000n, 10)).toMatchInlineSnapshot('"-420"');
    expect(formatUnits(-20000000000n, 9)).toMatchInlineSnapshot('"-20"');
    expect(formatUnits(-40000000000000000000n, 18)).toMatchInlineSnapshot(
        '"-40"'
    );
    expect(formatUnits(-12345n, 4)).toMatchInlineSnapshot('"-1.2345"');
    expect(formatUnits(-12345n, 4)).toMatchInlineSnapshot('"-1.2345"');
    expect(
        formatUnits(-6942069420123456789123450000n, 18)
    ).toMatchInlineSnapshot('"-6942069420.12345678912345"');
    expect(
        formatUnits(
            -694212312312306942012345444446789123450000000000000000000000000000000n,
            50
        )
    ).toMatchInlineSnapshot('"-6942123123123069420.1234544444678912345"');
});
