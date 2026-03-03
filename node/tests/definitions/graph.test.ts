import { describe, expect, test } from 'vitest'
import { FlagsGraph } from '~/definitions/graph'

describe(FlagsGraph, () => {
    test('put a definition in the graph', () => {
        const graph = new FlagsGraph<number>()

        const A = graph.put({ alias: 'A', value: 1 })

        expect(graph.definitions).toHaveLength(1)
        expect(graph.definitions).toContain(A)

        expect(A.isPlaceholder).toBe(false)
        expect(A.alias).toBe('A')
        expect(A.value).toBe(1)
    })

    test('create a definition with a reference to an existing definition', () => {
        const graph = new FlagsGraph<number>()

        const A = graph.put({ alias: 'A', value: 1 })

        expect(graph.definitions).toHaveLength(1)
        expect(graph.definitions).toContain(A)

        const B = graph.put({ alias: 'B', value: 2, parents: [{ alias: 'A' }] })

        expect(graph.definitions).toHaveLength(2)
        expect(graph.definitions).toContain(B)

        expect(B.parents).toContain(A)
        expect(A.children).toContain(B)
    })

    test('create a definition with a forward reference', () => {
        const graph = new FlagsGraph<number>()

        const B = graph.put({ alias: 'B', value: 2, parents: [{ alias: 'A' }] })

        expect(graph.definitions).toHaveLength(1)
        expect(graph.definitions).toContain(B)

        const A = graph.put({ alias: 'A', value: 1 })

        expect(graph.definitions).toHaveLength(2)
        expect(graph.definitions).toContain(A)
        expect(A.value).toBe(1)

        expect(B.parents).toContain(A)
        expect(A.children).toContain(B)
    })
})
