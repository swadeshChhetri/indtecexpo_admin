// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '../../context/AppProvider';
// // import { UNDERSCORE_NOT_FOUND_ROUTE } from 'next/dist/shared/lib/constants';


// interface formData {
//   name?: string,
//   email: string,
//   password: string,
//   password_confirmation?: string
// }

// const Auth: React.FC = () => {
//   const [isLogin, setIsLogin] = useState<boolean>(true);
//   const [formData, setFormData] = useState<formData>({
//     name: '',
//     email: '',
//     password: '',
//     password_confirmation: '',
//   });
//   const router = useRouter();

//   const { login, register, authToken } = useAuth();

//   useEffect(() => {
//     if (authToken) {
//       router.push("/");
//     }
//   }, [authToken, router]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (isLogin) {
//       try {
//         await login(formData.email, formData.password)
//       } catch (error) {
//         console.log(`Authentication  Error ${error}`)
//       }
//     } else {
//       try {
//         await register(formData.name!, formData.email, formData.password, formData.password_confirmation!)
//       } catch (error) {
//         console.log(error)
//       }
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
//       <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm">
//         <h2 className="text-center text-2xl font-semibold text-gray-800">
//           {isLogin ? "Login" : "Register"} to <span className="text-blue-600">KonnektGlobe</span>
//         </h2>

//         <form onSubmit={handleSubmit} className="mt-6 space-y-4">
//           {!isLogin && (
//             <input
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//               name="name"
//               type="text"
//               placeholder="Name"
//               required
//               value={formData.name}
//               onChange={handleChange}
//             />
//           )}

//           <input
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//             name="email"
//             type="email"
//             placeholder="Email"
//             required
//             value={formData.email}
//             onChange={handleChange}
//           />

//           <input
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//             name="password"
//             type="password"
//             placeholder="Password"
//             required
//             value={formData.password}
//             onChange={handleChange}
//           />

//           {!isLogin && (
//             <input
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//               name="password_confirmation"
//               type="password"
//               placeholder="Confirm Password"
//               required
//               value={formData.password_confirmation}
//               onChange={handleChange}
//             />
//           )}

//           <button
//             className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
//             type="submit"
//           >
//             {isLogin ? "Login" : "Register"}
//           </button>
//         </form>

//         <p className="mt-4 text-center text-gray-600">
//           {isLogin ? "Don't have an account? " : "Already have an account? "}
//           <span
//             onClick={() => setIsLogin(!isLogin)}
//             className="text-blue-600 font-medium cursor-pointer hover:underline"
//           >
//             {isLogin ? "Register" : "Login"}
//           </span>
//         </p>
//       </div>
//     </div>

//   );
// };

// export default Auth;