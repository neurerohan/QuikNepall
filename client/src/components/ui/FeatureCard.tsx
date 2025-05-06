import { Link } from 'wouter';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
  linkText: string;
}

const FeatureCard = ({ title, description, icon, link, linkText }: FeatureCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover-scale">
      <div className="h-3 bg-primary"></div>
      <div className="p-6">
        <div className="w-12 h-12 bg-primary-light/20 rounded-lg flex items-center justify-center mb-4">
          <i className={`ri-${icon}-line text-2xl text-primary`}></i>
        </div>
        <h3 className="text-xl font-bold mb-2 font-montserrat text-neutral">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link href={link} className="inline-flex items-center text-primary font-medium hover:text-primary-dark">
          {linkText} <i className="ri-arrow-right-line ml-1"></i>
        </Link>
      </div>
    </div>
  );
};

export default FeatureCard;
