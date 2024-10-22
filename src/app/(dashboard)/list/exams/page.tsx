import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { examsData, role } from '@/lib/data'
import prisma from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/settings'
import { Class, Exam, Lesson, Prisma, Subject, Teacher } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

// type Exam = {
//     id: number
//     subject: string
//     class: string
//     teacher: string
//     date: string
// }

type ExamList = Exam & {lesson: {
    subject: Subject,
    class: Class,
    teacher: Teacher
}}

const columns = [
    {
        header: 'Subject Name',
        accessor: 'subject',
    },
    {
        header: 'Class',
        accessor: 'class',
    },
    {
        header: 'Teacher',
        accessor: 'teacher',
        className: 'hidden md:table-cell'
    },
    {
        header: 'Date',
        accessor: 'date',
        className: 'hidden md:table-cell'
    },
    {
        header: 'Actions',
        accessor: 'actions',
    },
]

const renderRow = (item: ExamList) => {
    return <tr key={item.id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight'>
        <td className='flex items-center gap-4 p-4'>
            {item.lesson.subject.name}
        </td>
        <td>{item.lesson.class.name}</td>
        <td className='hidden md:table-cell'>{item.lesson.teacher.name + " " + item.lesson.teacher.surname}</td>
        <td className='hidden md:table-cell'>{new Intl.DateTimeFormat("en-US").format(item.startTime)}</td>
        <td>
            <div className='flex items-center gap-2'>
                {/* <Link href={`/list/teachers/${item.id}`}>
                    <button className='w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky'>
                        <Image src='/update.png' alt='' width={16} height={16} />
                    </button>
                </Link> */}
                {
                    role === 'admin' &&
                    (
                        <>
                            <FormModal table='exam' type='update' data={item} />
                            <FormModal table='exam' type='delete' id={item.id} />
                        </>
                        // <button className='w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple'>
                        //     <Image src='/delete.png' alt='' width={16} height={16} />
                        // </button>
                    )
                }
            </div>
        </td>
    </tr>
}

const ExamListPage = async ({searchParams} : {
    searchParams: {[key:string]:string | undefined}
}) => {

    const {page, ...queryParams} = searchParams

    const p = page ? parseInt(page) : 1

    const query: Prisma.ExamWhereInput = {}

    // URL PARAMS CONDITIONS
    if(queryParams){
        for(const [key, value] of Object.entries(queryParams)){
            if(value !== undefined){

                switch (key) {
                    case 'teacherId':
                        query.lesson = {teacherId: value}
                        break;
                    case 'classId':
                        query.lesson = {classId: parseInt(value)}
                        break;
                    case 'search':
                        query.lesson = {
                            subject: {
                                name: {contains: value, mode: 'insensitive'}
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const [data, count] = await prisma.$transaction([
        prisma.exam.findMany({
            where: query,
            include: {
                lesson: {
                    select: {
                        subject: {select: {name:true}},
                        teacher: {select: {name:true, surname:true}},
                        class: {select: {name:true}},
                    }
                }
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p-1)
        }),
        prisma.exam.count({
            where: query
        })
    ])

    return (
        <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
            {/* TOP */}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block text-lf font-semibold'>All Exams</h1>
                <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
                    <TableSearch />
                    <div className='flex items-center gap-4 self-end'>
                        <button className='w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow'>
                            <Image 
                            src='/filter.png'
                            alt=''
                            width={14}
                            height={14}
                            />
                        </button>
                        <button className='w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow'>
                            <Image 
                            src='/sort.png'
                            alt=''
                            width={14}
                            height={14}
                            />
                        </button>
                        {
                            role === 'admin' &&
                            <FormModal table='exam' type='create' />
                            // <button className='w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow'>
                            //     <Image 
                            //     src='/create.png'
                            //     alt=''
                            //     width={14}
                            //     height={14}
                            //     />
                            // </button>
                        }
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={data} />
            {/* PAGINATION */}
            <Pagination count={count} page={p} />
        </div>
    )
}

export default ExamListPage