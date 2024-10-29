---
role: rssitem
author: Unknown
published: 2024-10-23T14:00:00.000Z
link: https://realpython.com/python-thread-lock/
id: https://realpython.com/python-thread-lock/
feed: "[[Real Python]]"
tags: []
pinned: false
---

> [!abstract] Python Thread Safety: Using a Lock and Other Techniques - 2024-10-23T14:00:00.000Z
> ![image|float:right|400](https://files.realpython.com/media/Thread-Safety-in-Python_Watermarked.434d0dbc3127.jpg) In this tutorial, you'll learn about the issues that can occur when your code is run in a multithreaded environment. Then you'll explore the various synchronization primitives available in Python's threading module, such as locks, which help you make your code safe.

🌐 Read article [online](https://realpython.com/python-thread-lock/). ⤴ For other items in this feed see `= this.feed`.

- [ ] [[Python Thread Safety꞉ Using a Lock and Other Techniques]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -
Python threading allows you to run parts of your code concurrently, making the code more efficient. However, when you introduce threading to your code without knowing about thread safety, you may run into issues such as race conditions. You solve these with tools like locks, semaphores, events, conditions, and barriers.

By the end of this tutorial, you’ll be able to identify safety issues and prevent them by using the synchronization primitives in Python’s `threading` module to make your code thread-safe.

**In this tutorial, you’ll learn:**

- What **thread safety** is
- What **race conditions** are and how to avoid them
- How to identify **thread safety issues** in your code
- What different **synchronization primitives** exist in the `threading` module
- How to use synchronization primitives to **make your code thread-safe**

To get the most out of this tutorial, you’ll need to have basic experience working with multithreaded code using Python’s `threading` module and `ThreadPoolExecutor`.

**Get Your Code:** [Click here to download the free sample code](https://realpython.com/bonus/python-thread-lock-code/) that you’ll use to learn about thread safety techniques in Python.

==**Take the Quiz:**== Test your knowledge with our interactive “Python Thread Safety: Using a Lock and Other Techniques” quiz. You’ll receive a score upon completion to help you track your learning progress:

---

[

![Python Thread Safety: Using a Lock and Other Techniques](https://files.realpython.com/media/Thread-Safety-in-Python_Watermarked.434d0dbc3127.jpg)



](/quizzes/python-thread-lock/)

**Interactive Quiz**

[Python Thread Safety: Using a Lock and Other Techniques](/quizzes/python-thread-lock/)

In this quiz, you'll test your understanding of Python thread safety. You'll revisit the concepts of race conditions, locks, and other synchronization primitives in the threading module. By working through this quiz, you'll reinforce your knowledge about how to make your Python code thread-safe.

## Threading in Python[](#threading-in-python "Permanent link")

In this section, you’ll get a general overview of how Python handles threading. Before discussing threading in Python, it’s important to revisit two related terms that you may have heard about in this context:

- **Concurrency**: The ability of a system to handle multiple tasks by allowing their execution to overlap in time but not necessarily happen simultaneously.
- **Parallelism**: The simultaneous execution of multiple tasks that run at the same time to leverage multiple processing units, typically multiple CPU cores.

Python’s [threading](https://realpython.com/intro-to-python-threading/#what-is-a-thread) is a [concurrency framework](https://realpython.com/python-concurrency/) that allows you to spin up multiple threads that run concurrently, each executing pieces of code. This improves the efficiency and responsiveness of your application. When running multiple threads, the Python interpreter switches between them, handing the control of execution over to each thread.

By running the script below, you can observe the creation of four threads:

Python `threading_example.py`

```
import threading
import time
from concurrent.futures import ThreadPoolExecutor

def threaded_function():
    for number in range(3):
        print(f"Printing from {threading.current_thread().name}. {number=}")
        time.sleep(0.1)

with ThreadPoolExecutor(max_workers=4, thread_name_prefix="Worker") as executor:
    for _ in range(4):
        executor.submit(threaded_function)
```

In this example, `threaded_function` prints the values zero to two that your `for` loop assigns to the loop variable `number`. Using a `ThreadPoolExecutor`, four threads are created to execute the threaded function. `ThreadPoolExecutor` is configured to run a maximum of four threads concurrently with `max_workers=4`, and each worker thread is named with a “Worker” prefix, as in `thread_name_prefix="Worker"`.

In `print()`, the `.name` attribute on `threading.current_thread()` is used to get the name of the current thread. This will help you identify which thread is executed each time. A call to `sleep()` is added inside the threaded function to increase the likelihood of a context switch.

You’ll learn what a context switch is in just a moment. First, run the script and take a look at the output:

Shell

```
$ python threading_example.py
Printing from Worker_0. number=0
Printing from Worker_1. number=0
Printing from Worker_2. number=0
Printing from Worker_3. number=0
Printing from Worker_0. number=1
Printing from Worker_2. number=1
Printing from Worker_1. number=1
Printing from Worker_3. number=1
Printing from Worker_0. number=2
Printing from Worker_2. number=2
Printing from Worker_1. number=2
Printing from Worker_3. number=2
```

Each line in the output represents a `print()` call from a worker thread, identified by `Worker_0`, `Worker_1`, `Worker_2`, and `Worker_3`. The number that follows the worker thread name shows the current iteration of the loop each thread is executing. Each thread takes turns executing the `threaded_function`, and the execution happens in a concurrent rather than sequential manner.

For example, after `Worker_0` prints `number=0`, it’s not immediately followed by `Worker_0` printing `number=1`. Instead, you see outputs from `Worker_1`, `Worker_2`, and `Worker_3` printing `number=0` before `Worker_0` proceeds to `number=1`. You’ll notice from these interleaved outputs that multiple threads are running at the same time, taking turns to execute their part of the code.

This happens because the Python interpreter performs a [context switch](https://en.wikipedia.org/wiki/Context_switch). This means that Python pauses the execution state of the current thread and passes control to another thread. When the context switches, Python saves the current execution state so that it can resume later. By switching the control of execution at specific intervals, multiple threads can execute code concurrently.

You can check the context switch interval of your Python interpreter by typing the following in the REPL:

Python

```
>>> import sys
>>> sys.getswitchinterval()
0.005
```

The output of calling the `getswitchinterval()` is a number in seconds that represents the context switch interval of your Python interpreter. In this case, it’s 0.005 seconds or five milliseconds. You can think of the switch interval as how often the Python interpreter checks if it should switch to another thread.

An interval of five milliseconds doesn’t mean that threads switch exactly every five milliseconds, but rather that the interpreter considers switching to another thread at these intervals.

The switch interval is defined in the Python docs as follows:

## [Read the full article at https://realpython.com/python-thread-lock/ »](https://realpython.com/python-thread-lock/?utm_source=realpython&utm_medium=rss)

---

_［ Improve Your Python With 🐍 Python Tricks 💌 – Get a short & sweet Python Trick delivered to your inbox every couple of days. [＞＞ Click here to learn more and see examples](https://realpython.com/python-tricks/?utm_source=realpython&utm_medium=rss&utm_campaign=footer) ］_