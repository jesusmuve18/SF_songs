import tkinter as tk
from tkinter import messagebox
from tkinter import ttk
import subprocess
import os

def run_script():
    arg1 = entry1.get()
    arg2 = entry2.get()
    arg3 = entry3.get("1.0", tk.END).strip()
    arg5 = entry4.get()
    arg4 = combobox.get()

    # Obtener la ruta completa del script de bash
    script_path = os.path.join(os.getcwd(), 'python/song_adder.sh')

    if os.path.isfile(script_path):
        if arg1 and arg3 and arg4:
            try:
                # Ejecutar el script de bash con los argumentos
                result = subprocess.run(['bash', script_path, arg1, arg2, arg3, arg4, arg5], capture_output=True, text=True)
                
                # Mostrar la salida del script
                if result.returncode == 0:
                    output = result.stdout
                    messagebox.showinfo("Resultado", output)
                else:
                    messagebox.showerror("Error", f"El script devolvió un error: {result.stderr}")
            except Exception as e:
                messagebox.showerror("Error", f"Hubo un error al ejecutar el script: {e}")
        else:
            messagebox.showwarning("Campos vacíos", "Por favor, rellena todos los campos obligatorios.")
    else:
        messagebox.showerror("Error", f"No se encontró el script de bash en la ruta: {script_path}")

def clear_fields():
    # Limpiar los campos de texto
    entry1.delete(0, tk.END)
    entry2.delete(0, tk.END)
    entry4.delete(0, tk.END)
    entry3.delete("1.0", tk.END)
    # combobox.set(options[0])  # Restablecer el valor predeterminado del combobox

def generate():
    script_path = os.path.join(os.getcwd(), 'scripts/generate-all.sh')
    result = subprocess.run(['bash', script_path], capture_output=True, text=True)

     # Mostrar la salida del script
    if result.returncode == 0:
        output = result.stdout
        messagebox.showinfo("Resultado", output)

# Crear la ventana principal
root = tk.Tk()
root.title("Añadir Canción")

# Crear y colocar los campos de texto
tk.Label(root, text="*Título:").pack(pady=5)
entry1 = tk.Entry(root, width=39)
entry1.pack(pady=5, padx=30)

tk.Label(root, text="Autor:").pack(pady=5)
entry2 = tk.Entry(root, width=39)
entry2.pack(pady=5)

tk.Label(root, text="Cejilla (traste):").pack(pady=5)
entry4 = tk.Entry(root, width=39)
entry4.pack(pady=5)

tk.Label(root, text="*Letra (con acordes):").pack(pady=5)
entry3 = tk.Text(root, width=39)
entry3.pack(pady=5)

tk.Label(root, text="*Sección:").pack(pady=5)
options = ["General", "1-Dios mío y todas mis cosas", "2-Oración", "3-Navidad", "4-Pascua", "5-Otras"]
combobox = ttk.Combobox(root, values=options, width=39)  # Ancho ajustado
combobox.pack(pady=5)
combobox.current(0)  # Establecer la opción predeterminada


# Crear un marco para los botones y colocarlos en la misma línea
button_frame = tk.Frame(root)
button_frame.pack(pady=20)

# Crear y colocar el botón de ejecución y limpieza
execute_button = tk.Button(button_frame, text="Añadir", command=run_script)
execute_button.pack(side=tk.LEFT, padx=10)

clear_button = tk.Button(button_frame, text="Limpiar Campos", command=clear_fields)
clear_button.pack(side=tk.LEFT, padx=10)

clear_button = tk.Button(button_frame, text="Generar", command=generate)
clear_button.pack(side=tk.LEFT, padx=10)

# Iniciar el bucle principal de la interfaz gráfica
root.mainloop()
