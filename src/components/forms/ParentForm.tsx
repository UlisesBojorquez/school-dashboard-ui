'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import InputField from "../InputField";
import Image from "next/image";

const schema = z.object({
    username: z.string().min(3, { message: 'User name must be at least 3 characters long!' })
    .max(20, { message: 'User name must be at monst 20 characters long!' }),
    age: z.number().min(10),
    email: z.string().email({message: 'Invalid email address!'}),
    password: z.string().min(8, {message: 'Password must be at least 8 characters long!'}),
    firstName: z.string().min(1, {message: 'First Name is required!'}),
    lastName: z.string().min(1, {message: 'Last Name is required!'}),
    phone: z.string().min(1, {message: 'Phone is required!'}),
    address: z.string().min(1, {message: 'Address is required!'}),
    bloodType: z.string().min(1, {message: 'Blood Type is required!'}),
    birthday: z.date({message: 'Birthday is required!'}),
    sex: z.enum(['male', 'female'], {message: 'Sex is required!'}),
    img: z.instanceof(File, {message:'Image is required!'})
})

type Inputs = z.infer<typeof schema>

const ParentForm = ({type, data}: {type: 'create' | 'update', data?: any}) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<Inputs>({
        resolver: zodResolver(schema),
    })

    const onSubmit = handleSubmit(data => {
        console.log(data)
    })

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">Create new parent</h1>
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
            <div className="flex justify-between flex-wrap gap-4">
                <InputField 
                label="First Name"
                name="firstName"
                register={register}
                error={errors.firstName}
                defaultValue={data?.firstName}
                />
                <InputField 
                label="Last Name"
                name="lastName"
                register={register}
                error={errors.lastName}
                defaultValue={data?.lastName}
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
                defaultValue={data?.birthday}
                type="date"
                />
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Sex</label>
                    <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register('sex')} defaultValue={data?.sex}>
                        <option value='male'>Male</option>
                        <option value='female'>Female</option>
                    </select>
                    {errors.sex?.message && <p className="text-xs text-red-400">{errors.sex?.message.toString()}</p>}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
                    <label className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer" htmlFor="img">
                        <Image 
                        src='/upload.png'
                        alt=""
                        width={28}
                        height={28}
                        />
                        <span>Uload a photo</span>
                    </label>
                    <input 
                    type="file"
                    {...register('img')}
                    className="hidden"
                    id="img"
                    />
                    {errors.img?.message && <p className="text-xs text-red-400">{errors.img?.message.toString()}</p>}
                </div>
            </div>
            <button type='submit' className="bg-blue-400 text-white p-2 rounded-md">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    )
}

export default ParentForm