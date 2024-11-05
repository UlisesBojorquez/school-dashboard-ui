import prisma from "@/lib/prisma"

const StudentAttendanceCard = async ({id}: {id:string}) => {

    const attendance = await prisma.attendance.findMany({
        where: {
            studentId: id,
            date: {
                gte: new Date(new Date().getFullYear(), 0, 1)
            }
        }
    })

    const totalDays = attendance.length
    const presentDays = attendance.filter((day) => day.present).length
    const percentage = (presentDays / totalDays) * 100

    return (
        <div>
            <h1 className='text-xl font-semibold'>{percentage || '-'}%</h1>
            <span className='text-gray-400 text-sm'>Attendance</span>
        </div>
    )
}

export default StudentAttendanceCard