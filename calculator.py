# Smart Basic Calculator

def perform_operation(num1, num2, operation):
    """Performs the basic arithmetic operation"""
    if operation == '+':
        return num1 + num2
    elif operation == '-':
        return num1 - num2
    elif operation == '*':
        return num1 * num2
    elif operation == '/':
        if num2 != 0:
            return num1 / num2
        else:
            return "Error: Cannot divide by zero!"
    else:
        return "Error: Invalid operation!"


print("Welcome to Akolo's Smart Calculator!")
print("You can use + for add, - for subtract, * for multiply, / for divide.")
print("Type 'exit' anytime to quit.\n")

while True:
    try:
        first_input = input("Enter the first number (or type 'exit'): ")
        if first_input.lower() == 'exit':
            print("Goodbye! Thank you for using the calculator.")
            break

        num1 = float(first_input)

        second_input = input("Enter the second number: ")
        num2 = float(second_input)

        operation = input("Enter an operation (+, -, *, /): ")

        result = perform_operation(num1, num2, operation)
        print(f"Result: {num1} {operation} {num2} = {result}\n")

    except ValueError:
        print("⚠️ Please enter valid numbers.\n")
    except Exception as e:
        print(f"⚠️ Unexpected error: {e}\n")