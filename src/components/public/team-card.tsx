'use client';

import { User } from 'lucide-react';

interface TeamCardProps {
  name: string;
  role: string;
  bio: string;
  image?: string;
}

export function TeamCard({ name, role, bio, image }: TeamCardProps) {
  return (
    <div className="group [perspective:1000px]">
      <div className="relative w-full h-80 transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          <div className="h-full flex flex-col items-center justify-center bg-white p-6">
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-28 h-28 rounded-full object-cover border-4 border-ada-purple/20"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-ada-purple/10 flex items-center justify-center border-4 border-ada-purple/20">
                <User className="w-14 h-14 text-ada-purple/50" />
              </div>
            )}
            <h3 className="mt-5 font-poppins text-xl font-bold text-ada-navy">
              {name}
            </h3>
            <p className="mt-1 text-sm text-ada-purple font-medium">{role}</p>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden shadow-lg">
          <div className="h-full flex flex-col items-center justify-center bg-ada-navy p-6 text-center">
            <h3 className="font-poppins text-lg font-bold text-white">
              {name}
            </h3>
            <p className="mt-1 text-sm text-ada-purple-accent font-medium">
              {role}
            </p>
            <p className="mt-4 text-white/80 text-sm leading-relaxed">{bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
