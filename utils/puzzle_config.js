var config = {}

config.port = 2016

config.puzzle_one = '/JOURNEY' // answer = LANGUAGE
// L = Germany (LEU -> DEU)
// A = Albania (ALA -> ALB)
// N = American Samoa (ASN -> ASM)
// G = U.A.E. (ARG -> ARE)
// U = Guadeloupe (GLU -> GLP)
// A = Spain (ASP -> ESP)
// G = Armenia (ARG -> ARM)
// E = Philipinnes (PHE -> PHL)
// Argentina (ARG) and Aland Islands (ALA) are red herrings.

config.puzzle_two = '/LANGUAGE' // answer = MUSICAL
// George Ezra -> Budapest -> Hungarian -> M
// Yael Naim -> Paris -> French -> U
// Nicki Minaj -> Shanghai -> Chinese -> S
// RY X -> Berlin -> German -> I
// Phoenix -> Rome -> Italian -> C
// Matisyahu -> Tel Aviv -> Hebrew -> A
// Imagine Dragons -> Tokyo -> Japanese -> L

config.puzzle_three = '/MUSICAL' // answer = META
// First line of haiku refers to 19, which is our prime modulus.
// Second line says use multiplicative inverse, the modular addition, and inverse again.
// Stones with numbers are meant to be added to row they are on.
// Cipher tell which start characters to use. Use integral part of coordinates from there.
// F -> F15 -> 15 -> 14 -> 9 -> 17 -> M17 -> M
// S -> S12 -> 12 -> 8 -> 10 -> 2 -> E2 -> E
// J -> J16 -> 16 -> 6 -> 3 -> 13 -> T13 -> T
// Q -> Q5 -> 5 -> 4 -> 7 -> 11 -> A11 -> A

config.puzzle_meta = '/META'
config.meta_ans1 = 'central african republic' // average of argentina and aland islands ISO numeric codes
config.meta_ans2 = 'new soul' // song by yael naim that sounds like neo seoul
config.meta_ans3 = '79' // move number of K10 in relevant game

config.congrats = '/FIN'

module.exports = config
