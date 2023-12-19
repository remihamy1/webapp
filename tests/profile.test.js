import { expect, test } from 'vitest'
import { validatePassword } from '../models/profile.js'

//Test de la fonction validatePassword
test('Test function validatePassword -> password is ok', () => {
    expect(validatePassword("Epsi1234*")).toBe(true)
})

test('Test function validatePassword -> password is ko', () => {
    expect(validatePassword("1234")).toBe(false)
})