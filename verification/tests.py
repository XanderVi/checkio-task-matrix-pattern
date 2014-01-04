"""
TESTS is a dict with all you tests.
Keys for this will be categories' names.
Each test is dict with
    "input" -- input data for user function
    "answer" -- your right answer
    "explanation" -- not necessary key, it's using for additional info in animation.
"""

TESTS = {
    "Basics": [
        {
            "input": [
                [[1, 0],
                 [1, 1]],
                [[0, 1, 0, 1, 0],
                 [0, 1, 1, 0, 0],
                 [1, 0, 1, 1, 0],
                 [1, 1, 0, 1, 1],
                 [0, 1, 1, 0, 0]]],
            "answer": [[0, 3, 2, 1, 0],
                       [0, 3, 3, 0, 0],
                       [3, 2, 1, 3, 2],
                       [3, 3, 0, 3, 3],
                       [0, 1, 1, 0, 0]],
            "explanation":
                [[0, 1], [2, 0], [2, 3]]
        },
        {
            "input": [
                [[1, 1],
                 [1, 1]],
                [[1, 1, 1],
                 [1, 1, 1],
                 [1, 1, 1]]],
            "answer": [[3, 3, 1],
                       [3, 3, 1],
                       [1, 1, 1]],
            "explanation":
                [[0, 0]]
        }
    ],
    "Extra": [
        {
            "input": [
                [[1, 0],
                 [1, 1]],
                [[0, 1, 0, 1, 0],
                 [0, 1, 1, 0, 0],
                 [1, 0, 1, 1, 0],
                 [1, 1, 0, 1, 1],
                 [0, 1, 1, 0, 0]]],
            "answer": [[0, 3, 2, 1, 0],
                       [0, 3, 3, 0, 0],
                       [3, 2, 1, 3, 2],
                       [3, 3, 0, 3, 3],
                       [0, 1, 1, 0, 0]],
            "explanation":
                [[0, 1], [2, 0], [2, 3]]
        },
        {
            "input": [
                [[1, 1],
                 [1, 1]],
                [[1, 1, 1],
                 [1, 1, 1],
                 [1, 1, 1]]],
            "answer": [[3, 3, 1],
                       [3, 3, 1],
                       [1, 1, 1]],
            "explanation":
                [[0, 0]]
        }
    ]
}
