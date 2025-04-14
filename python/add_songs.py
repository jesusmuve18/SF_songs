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

def generate_song():

    run_script()

    arg1 = entry1.get()
    arg2 = entry2.get()
    arg3 = entry3.get("1.0", tk.END).strip()
    arg5 = entry4.get()
    arg4 = combobox.get()

    # Obtener la ruta completa del script de bash
    script_path = os.path.join(os.getcwd(), 'python/song_generator.sh')

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

def copy_link():
    enlace="localhost:5500/songs/"
    titulo=entry1.get().replace(" ", "_")
    autor=entry2.get().replace(" ", "_")

    enlace+=titulo

    if(titulo != ''):
        enlace+="-"+autor
    
    enlace+=".html"

    root.clipboard_clear()
    root.clipboard_append(enlace)
    root.update()  # Necesario para que se mantenga después de cerrar la ventana
    messagebox.showinfo("Resultado", "Enlace copiado al portapapeles")

def generate_index():
    script_path = os.path.join(os.getcwd(), 'scripts/generate-index.sh')
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
options = ["General", "1-Oración", "2-Dios mío y todas mis cosas", "3-Qué noche tan grande", "4-Te_llena_de_vida","5-Pascua","6-Hakuna", "7-Otras"]
combobox = ttk.Combobox(root, values=options, width=39)  # Ancho ajustado
combobox.pack(pady=5)
combobox.current(0)  # Establecer la opción predeterminada


# Crear un marco para los botones y colocarlos en la misma línea
button_frame1 = tk.Frame(root)
button_frame1.pack(pady=(20,10))

# Crear y colocar el botón de ejecución, limpieza y generación
execute_button = tk.Button(button_frame1, text="Añadir", command=run_script)
execute_button.pack(side=tk.LEFT, padx=10)

clear_button = tk.Button(button_frame1, text="Limpiar Campos", command=clear_fields)
clear_button.pack(side=tk.LEFT, padx=10)

generate_all_button = tk.Button(button_frame1, text="Generar", command=generate)
generate_all_button.pack(side=tk.LEFT, padx=10)

# Crear un marco para los botones y colocarlos en la misma línea
button_frame2 = tk.Frame(root)
button_frame2.pack(pady=(10,10))

generate_song_button = tk.Button(button_frame2, text="Generar canción", command=generate_song)
generate_song_button.pack(side=tk.LEFT, padx=(5,5))

copy_link_button = tk.Button(button_frame2, text="Copiar enlace", command=copy_link)
copy_link_button.pack(side=tk.LEFT, padx=(5,5))

# Crear un marco para los botones y colocarlos en la misma línea
button_frame3 = tk.Frame(root)
button_frame3.pack(pady=(10,20))

generate_index_button = tk.Button(button_frame3, text="Generar índice", command=generate_index)
generate_index_button.pack(side=tk.LEFT, padx=(5,5))

# Iniciar el bucle principal de la interfaz gráfica
root.mainloop()
