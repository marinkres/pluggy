---
title: "Exploring CLI tool development: Utibat"
description: "As a system engineer, I’m always looking for ways to streamline my workflow and make system monitoring more efficient. "
publishDate: "16 jul 2024"
updatedDate: 16 jul 2024
tags: ["dev", "lab"]
---

## Exploring Terminal App Development
As a system engineer, I’m always looking for ways to streamline my workflow and make system monitoring more efficient. Recently, I decided to dive into the world of terminal applications. This journey led me to create UtiBat, a simple CLI tool to monitor laptop battery status.

### Why Terminal Apps?
Terminal applications are powerful tools that can simplify many tasks for system engineers and power users. They offer a lightweight, efficient way to interact with the system without the overhead of a graphical user interface. Plus, building terminal apps can be a great way to improve your command-line skills and learn more about system internals.

**The Idea Behind UtiBat**:
I wanted a quick and easy way to see my battery percentage without leaving the command line.

To build UtiBat, I used **Python** along with a few essential libraries:

- Click: For creating command-line commands.
- Psutil: For accessing system battery information.
- Colorama: For adding color to the terminal output.

### Understanding Click
Click is a Python package that simplifies the creation of command-line interfaces. It is highly configurable and user-friendly, making it an excellent choice for building CLI tools. With Click, you can easily define commands, handle arguments, and create complex command structures with minimal code. In UtiBat, Click is used to define the battery command, which displays the battery percentage and progress bar. The @click.group() decorator is used to group commands, while the @cli.command() decorator defines individual commands within the group. This modular approach makes the code clean and easy to maintain.

### Leveraging Psutil
Psutil is a cross-platform library for accessing system details and process utilities. It provides an interface for retrieving information on system utilization (CPU, memory, disks, network, sensors) and running processes. In UtiBat, Psutil is used to access the battery information through the psutil.sensors_battery() function. This function returns the battery status, including the current percentage, which is then used to display the battery level and progress bar. Psutil is a powerful tool, offering a wide range of functionalities to monitor and manage system resources effectively. 

Here’s a step-by-step guide to creating UtiBat.

## Getting started
### Step 1: Setting Up the Environment
First, ensure you have Python installed on your system. Then, install the required libraries:

```bash title="Terminal"
pip install click psutil colorama
```

### Step 2: Writing the Code
Next, I wrote the code for UtiBat. The main components include functions to get the battery percentage, print a progress bar, and define the CLI commands.

```python title="Python"
import click
import psutil
from colorama import Fore, Style

def get_battery_percentage():
    battery = psutil.sensors_battery()
    return battery.percent if battery else None

def print_progress_bar(percentage):
    length = 20
    filled_length = int(length * percentage / 100)
    bar = f"[{'#' * filled_length}{'-' * (length - filled_length)}]"
    return bar

@click.group()
def cli():
    pass

@cli.command()
def battery():
    percentage = get_battery_percentage()
    if percentage is not None:
        color = Fore.GREEN if percentage >= 80 else Fore.YELLOW
        formatted_percentage = f"{percentage}%".rjust(4)
        click.echo(f"{color}Battery Percentage: {formatted_percentage}{Style.RESET_ALL}")
        click.echo(print_progress_bar(percentage))
    else:
        click.echo("Battery information not available.")

if __name__ == '__main__':
    cli()

```

## Running UtiBat

>To use UtiBat in **local development**, simply run the following command in your terminal: python utibat.py battery


To install the latest version of UtiBat you can use pip:
```bash title="Terminal"
pip install utibat
```
### Usage: 
```bash title="Terminal"
utibat battery
```
This will display the current battery percentage along with a progress bar.

### Example Output:
![Utibat Output](./utibat.png)

Or 

Check the [Github link](https://github.com/marinkres/utibat) and the [PyPI documentation](https://pypi.org/project/utibat/).


