'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { createStudent, updateStudent } from "@/lib/actions";
import { studentSchema, StudentSchema } from "@/lib/formValidationSchemas";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";

// const schema = z.object({
//     username: z.string().min(3, { message: 'User name must be at least 3 characters long!' })
//     .max(20, { message: 'User name must be at monst 20 characters long!' }),
//     age: z.number().min(10),
//     email: z.string().email({message: 'Invalid email address!'}),
//     password: z.string().min(8, {message: 'Password must be at least 8 characters long!'}),
//     firstName: z.string().min(1, {message: 'First Name is required!'}),
//     lastName: z.string().min(1, {message: 'Last Name is required!'}),
//     phone: z.string().min(1, {message: 'Phone is required!'}),
//     address: z.string().min(1, {message: 'Address is required!'}),
//     bloodType: z.string().min(1, {message: 'Blood Type is required!'}),
//     birthday: z.date({message: 'Birthday is required!'}),
//     sex: z.enum(['male', 'female'], {message: 'Sex is required!'}),
//     img: z.instanceof(File, {message:'Image is required!'})
// })

// type Inputs = z.infer<typeof schema>

const StudentForm = ({type, data, setOpen, relatedData}: {type: 'create' | 'update', data?: any, setOpen: Dispatch<SetStateAction<boolean>>, relatedData?: any}) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<StudentSchema>({
        resolver: zodResolver(studentSchema),
    })

    const [img, setImg] = useState<any>()

    // after react 19 will be actionsstate
    const [state, formAction] = useFormState(type === 'create'? createStudent : updateStudent, {success: false, error:false})

    const onSubmit = handleSubmit(data => {
        console.log(data)
        formAction(data)
    })

    const router = useRouter()

    useEffect(() => {
        if(state.success){
            toast(`Student has been ${type === 'create' ? 'created' : 'updated'}`)
            setOpen(false)
            router.refresh()
        }
    }, [state, router, type, setOpen])

    const {grades, classes} = relatedData

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === 'create' ? 'Create new student' : 'Update the student'}</h1>
            <span className="text-xs text-gray-400 font-medium">Authentication Information</span>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField 
                label="Username"
                name="username"
                register={register}
                error={errors.username}
                defaultValue={data?.username}
                />
                <InputField 
                label="Email"
                name="email"
                type="email"
                register={register}
                error={errors.email}
                defaultValue={data?.email}
                />
                <InputField 
                label="Password"
                name="password"
                type="password"
                register={register}
                error={errors.password}
                defaultValue={data?.password}
                />
            </div>
            <span className="text-xs text-gray-400 font-medium">Personal Information</span>
            <CldUploadWidget uploadPreset="school" onSuccess={(result, {widget}) => {
                    setImg(result.info)
                    widget.close()
                }}>
                {({ open }) => {
                    return (
                        <div className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer" onClick={() => open()}>
                            <Image 
                            src='/upload.png'
                            alt=""
                            width={28}
                            height={28}
                            />
                            <span>Uload a photo</span>
                        </div>
                    );
                }}
                </CldUploadWidget>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField 
                label="First Name"
                name="name"
                register={register}
                error={errors.name}
                defaultValue={data?.name}
                />
                <InputField 
                label="Last Name"
                name="surname"
                register={register}
                error={errors.surname}
                defaultValue={data?.surname}
                />
                <InputField 
                label="Phone"
                name="phone"
                register={register}
                error={errors.phone}
                defaultValue={data?.phone}
                />
                <InputField 
                label="Address"
                name="address"
                register={register}
                error={errors.address}
                defaultValue={data?.address}
                />
                <InputField 
                label="Blood Type"
                name="bloodType"
                register={register}
                error={errors.bloodType}
                defaultValue={data?.bloodType}
                />
                <InputField 
                label="Birthday"
                name="birthday"
                register={register}
                error={errors.birthday}
                defaultValue={data?.birthday.toISOString().split('T')[0]}
                type="date"
                />
                <InputField 
                label="Parent Id"
                name="parentId"
                register={register}
                error={errors.parentId}
                defaultValue={data?.parentId}
                />
                {data && <InputField 
                label="Id"
                name="id"
                register={register}
                error={errors?.id}
                defaultValue={data?.id}
                hidden
                />}
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Sex</label>
                    <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register('sex')} defaultValue={data?.sex}>
                        <option value='male'>Male</option>
                        <option value='female'>Female</option>
                    </select>
                    {errors.sex?.message && <p className="text-xs text-red-400">{errors.sex?.message.toString()}</p>}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Grade</label>
                    <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register('gradeId')} defaultValue={data?.gradeId}>
                        {
                            grades.map((grade: {id:string, level:number}) => (
                                <option value={grade.id} key={grade.id}>{grade.level}</option>
                            ))
                        }
                    </select>
                    {errors.gradeId?.message && <p className="text-xs text-red-400">{errors.gradeId?.message.toString()}</p>}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Class</label>
                    <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register('classId')} defaultValue={data?.classId}>
                        {
                            classes.map((classItem: {id:string, name:string, capacity: number, _count:{students:number}}) => (
                                <option value={classItem.id} key={classItem.id}>{classItem.name} - {classItem._count.students + '/' + classItem.capacity}{' '}Capacity</option>
                            ))
                        }
                    </select>
                    {errors.classId?.message && <p className="text-xs text-red-400">{errors.classId?.message.toString()}</p>}
                </div>
            </div>
            {state.error && <span className="text-red-500">Something went wrong</span>}
            <button type='submit' className="bg-blue-400 text-white p-2 rounded-md">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    )
}

export default StudentForm