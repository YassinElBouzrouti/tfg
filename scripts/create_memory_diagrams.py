from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(r"C:\Users\Yassin\OneDrive\Escritorio\gym_artes_marciales")
OUT = ROOT / "capturas_memoria"
OUT.mkdir(parents=True, exist_ok=True)


def font(size=24):
    try:
        return ImageFont.truetype("arial.ttf", size)
    except Exception:
        return ImageFont.load_default()


def draw_arrow(draw, x1, y1, x2, y2, color=(20, 20, 20), width=4):
    draw.line((x1, y1, x2, y2), fill=color, width=width)
    # Simple arrow head
    dx, dy = x2 - x1, y2 - y1
    l = max((dx * dx + dy * dy) ** 0.5, 1)
    ux, uy = dx / l, dy / l
    px, py = -uy, ux
    p1 = (x2 - 16 * ux + 8 * px, y2 - 16 * uy + 8 * py)
    p2 = (x2 - 16 * ux - 8 * px, y2 - 16 * uy - 8 * py)
    draw.polygon([(x2, y2), p1, p2], fill=color)


def box(draw, xy, title, lines=None, fill=(245, 248, 255), outline=(40, 70, 120)):
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle(xy, radius=18, fill=fill, outline=outline, width=3)
    draw.text((x1 + 16, y1 + 12), title, fill=(0, 0, 0), font=font(24))
    if lines:
        y = y1 + 48
        for line in lines:
            draw.text((x1 + 16, y), line, fill=(35, 35, 35), font=font(18))
            y += 26


def figure_1_architecture():
    img = Image.new("RGB", (1800, 1000), (255, 255, 255))
    d = ImageDraw.Draw(img)
    d.text((50, 30), "Figura 1. Arquitectura General de la Solucion", fill=(0, 0, 0), font=font(34))

    box(d, (80, 210, 520, 560), "Cliente Web", ["React + Vite", "Tailwind CSS", "Axios", "Rutas publicas/privadas"])
    box(d, (670, 210, 1130, 560), "API Backend", ["Node.js + Express", "JWT + Middlewares", "Controladores", "Reglas de negocio"])
    box(d, (1280, 210, 1720, 560), "Base de Datos", ["PostgreSQL", "Prisma ORM", "Migraciones", "Seed de datos"])

    draw_arrow(d, 520, 380, 670, 380)
    draw_arrow(d, 1130, 380, 1280, 380)

    d.text((520, 330), "HTTPS / JSON", fill=(30, 30, 30), font=font(18))
    d.text((1165, 330), "Prisma Client", fill=(30, 30, 30), font=font(18))
    d.text((70, 900), "Nota. El frontend consume endpoints REST y el backend persiste en PostgreSQL mediante Prisma.", fill=(40, 40, 40), font=font(20))
    img.save(OUT / "figure_1_architecture.png")


def figure_2_navigation():
    img = Image.new("RGB", (1800, 1100), (255, 255, 255))
    d = ImageDraw.Draw(img)
    d.text((50, 25), "Figura 2. Diagrama de Navegacion Principal", fill=(0, 0, 0), font=font(34))

    box(d, (80, 140, 390, 270), "Home (/)", ["Publico"])
    box(d, (480, 140, 790, 270), "Register (/register)", ["Alta de miembro"])
    box(d, (880, 140, 1190, 270), "Login (/login)", ["Acceso miembro"])
    box(d, (1280, 140, 1690, 270), "Admin Access (/admin)", ["Acceso administrador"])

    box(d, (420, 430, 850, 620), "Panel Miembro (/member)", ["Perfil", "Reservas", "Pagos", "Asistencia"])
    box(d, (980, 430, 1660, 700), "Panel Admin (/admin/dashboard)", ["Miembros", "Pagos", "Clases", "Perfil miembro"])
    box(d, (980, 770, 1660, 960), "Detalle Miembro (/admin/members/:id)", ["Historial completo"])

    draw_arrow(d, 390, 205, 480, 205)
    draw_arrow(d, 790, 205, 880, 205)
    draw_arrow(d, 1040, 270, 640, 430)
    draw_arrow(d, 1485, 270, 1320, 430)
    draw_arrow(d, 1320, 700, 1320, 770)

    d.text((70, 1020), "Nota. Las rutas privadas se protegen por rol con validacion de sesion JWT.", fill=(40, 40, 40), font=font(20))
    img.save(OUT / "figure_2_navigation.png")


def figure_3_network():
    img = Image.new("RGB", (1700, 900), (255, 255, 255))
    d = ImageDraw.Draw(img)
    d.text((50, 30), "Figura 3. Diagrama Conceptual de Red", fill=(0, 0, 0), font=font(34))

    box(d, (80, 240, 460, 520), "Dispositivo Usuario", ["Navegador", "PC/Tablet/Movil"])
    box(d, (650, 190, 1060, 570), "Servidor Aplicacion", ["Frontend statico", "API Express", "Control de acceso"])
    box(d, (1240, 240, 1610, 520), "Servidor BD", ["PostgreSQL", "Backups"])

    draw_arrow(d, 460, 380, 650, 380)
    draw_arrow(d, 1060, 380, 1240, 380)
    d.text((500, 340), "HTTPS", fill=(0, 0, 0), font=font(20))
    d.text((1110, 340), "Conexion interna", fill=(0, 0, 0), font=font(20))
    d.text((60, 820), "Nota. Topologia simplificada para despliegue de una aplicacion web full stack.", fill=(40, 40, 40), font=font(20))
    img.save(OUT / "figure_3_network.png")


def figure_4_er():
    img = Image.new("RGB", (1900, 1200), (255, 255, 255))
    d = ImageDraw.Draw(img)
    d.text((50, 20), "Figura 4. Diagrama Entidad-Relacion (E/R)", fill=(0, 0, 0), font=font(34))

    box(d, (70, 140, 430, 380), "User", ["id (PK)", "name", "lastName", "email (UQ)", "role"])
    box(d, (520, 140, 880, 380), "Membership", ["id (PK)", "userId (FK)", "planId (FK)", "status", "startDate, endDate"])
    box(d, (970, 140, 1330, 380), "Plan", ["id (PK)", "name (UQ)", "price", "durationMonths", "isActive"])
    box(d, (1420, 140, 1780, 380), "Payment", ["id (PK)", "membershipId (FK)", "status", "amount", "method"])

    box(d, (300, 620, 700, 910), "Booking", ["id (PK)", "userId (FK)", "martialClassId (FK)", "scheduledFor", "status"])
    box(d, (780, 620, 1180, 910), "MartialClass", ["id (PK)", "code (UQ)", "discipline", "dayOfWeek", "capacity"])
    box(d, (1260, 650, 1660, 900), "Attendance", ["id (PK)", "bookingId (FK,UQ)", "attended", "checkedInAt"])

    draw_arrow(d, 430, 260, 520, 260)
    draw_arrow(d, 880, 260, 970, 260)
    draw_arrow(d, 1330, 260, 1420, 260)
    draw_arrow(d, 260, 380, 420, 620)
    draw_arrow(d, 620, 380, 500, 620)
    draw_arrow(d, 1040, 380, 980, 620)
    draw_arrow(d, 700, 770, 780, 770)
    draw_arrow(d, 1180, 770, 1260, 770)

    d.text((60, 1140), "Nota. Se separa identidad, relacion comercial y actividad operativa del gimnasio.", fill=(40, 40, 40), font=font(20))
    img.save(OUT / "figure_4_er.png")


def figure_5_components():
    img = Image.new("RGB", (1900, 1100), (255, 255, 255))
    d = ImageDraw.Draw(img)
    d.text((50, 20), "Figura 5. Diagrama Logico de Componentes Backend", fill=(0, 0, 0), font=font(34))

    box(d, (80, 150, 440, 420), "Routes", ["authRoutes", "adminRoutes", "bookingRoutes", "paymentRoutes"])
    box(d, (520, 150, 880, 420), "Controllers", ["authController", "adminController", "bookingController", "paymentController"])
    box(d, (960, 150, 1320, 420), "Middlewares", ["authMiddleware", "requireRole", "errorHandler", "notFound"])
    box(d, (1400, 150, 1760, 420), "Data Layer", ["prisma client", "schema", "migrations", "seed"])

    box(d, (520, 620, 880, 930), "Utils", ["jwt.js", "AppError.js", "normalizacion de planes"])
    box(d, (960, 620, 1320, 930), "Business Rules", ["pagos<->membresia", "aforo", "duplicados", "concurrencia reservas"])

    draw_arrow(d, 440, 280, 520, 280)
    draw_arrow(d, 880, 280, 960, 280)
    draw_arrow(d, 1320, 280, 1400, 280)
    draw_arrow(d, 700, 420, 700, 620)
    draw_arrow(d, 1140, 420, 1140, 620)
    draw_arrow(d, 880, 760, 960, 760)

    d.text((60, 1040), "Nota. Organizacion modular para separar responsabilidades y facilitar mantenibilidad.", fill=(40, 40, 40), font=font(20))
    img.save(OUT / "figure_5_components.png")


def figure_20_responsive_collage():
    pc = Image.open(OUT / "01_home_pc.png").convert("RGB")
    tb = Image.open(OUT / "05_home_tablet.png").convert("RGB")
    mb = Image.open(OUT / "06_home_mobile.png").convert("RGB")

    canvas = Image.new("RGB", (2000, 1200), (255, 255, 255))
    d = ImageDraw.Draw(canvas)
    d.text((40, 20), "Figura 20. Vista Comparada Responsive PC-Tablet-Movil", fill=(0, 0, 0), font=font(34))

    pc.thumbnail((1100, 900))
    tb.thumbnail((500, 900))
    mb.thumbnail((320, 900))

    canvas.paste(pc, (40, 140))
    canvas.paste(tb, (1180, 140))
    canvas.paste(mb, (1680, 140))
    d.text((40, 1110), "Nota. Comparativa visual de adaptacion responsive en tres dispositivos.", fill=(40, 40, 40), font=font(20))
    canvas.save(OUT / "figure_20_responsive.png")


def figure_21_gantt():
    img = Image.new("RGB", (1900, 1000), (255, 255, 255))
    d = ImageDraw.Draw(img)
    d.text((50, 20), "Figura 21. Diagrama de Gantt (Estimado vs Real)", fill=(0, 0, 0), font=font(34))

    phases = [
        ("Analisis y requisitos", 2, 2),
        ("Diseno tecnico y datos", 3, 3),
        ("Backend", 5, 6),
        ("Frontend", 5, 6),
        ("Integracion y depuracion", 3, 4),
        ("Pruebas", 2, 3),
        ("Documentacion", 3, 4),
    ]

    start_x = 430
    top = 150
    row_h = 95
    week_w = 95

    for w in range(1, 13):
        x = start_x + (w - 1) * week_w
        d.rectangle((x, 100, x + week_w, 140), outline=(180, 180, 180))
        d.text((x + 30, 110), f"S{w}", fill=(0, 0, 0), font=font(16))

    current_week = 1
    for idx, (name, est, real) in enumerate(phases):
        y = top + idx * row_h
        d.text((50, y + 20), name, fill=(0, 0, 0), font=font(20))
        ex1 = start_x + (current_week - 1) * week_w
        ex2 = ex1 + est * week_w - 10
        rx1 = start_x + (current_week - 1) * week_w
        rx2 = rx1 + real * week_w - 10
        d.rounded_rectangle((ex1, y + 10, ex2, y + 40), radius=8, fill=(102, 178, 255), outline=(40, 100, 180))
        d.rounded_rectangle((rx1, y + 50, rx2, y + 80), radius=8, fill=(255, 153, 102), outline=(200, 80, 40))
        current_week += est
        if current_week > 12:
            current_week = 12

    d.rectangle((50, 900, 90, 930), fill=(102, 178, 255), outline=(40, 100, 180))
    d.text((100, 905), "Planificacion estimada", fill=(0, 0, 0), font=font(18))
    d.rectangle((360, 900, 400, 930), fill=(255, 153, 102), outline=(200, 80, 40))
    d.text((410, 905), "Ejecucion real", fill=(0, 0, 0), font=font(18))
    d.text((50, 960), "Nota. Visualizacion comparativa de desviaciones por bloque de trabajo.", fill=(40, 40, 40), font=font(20))
    img.save(OUT / "figure_21_gantt.png")


def main():
    figure_1_architecture()
    figure_2_navigation()
    figure_3_network()
    figure_4_er()
    figure_5_components()
    figure_20_responsive_collage()
    figure_21_gantt()
    print("Diagramas generados en capturas_memoria")


if __name__ == "__main__":
    main()

