import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, FileText } from "lucide-react";
import PageShell from "@/components/PageShell";
import { SERVICE_CATEGORIES } from "@/data/serviceData";
import { useAppState } from "@/context/AppContext";

const ServiceCategory = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { customerName } = useAppState();

  if (!customerName) { navigate("/"); return null; }

  const category = SERVICE_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) { navigate("/dashboard"); return null; }

  return (
    <PageShell title={category.name}>
      <div className="flex flex-col gap-4">
        {category.services.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="bg-card p-5 rounded-lg shadow-card"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-foreground">{service.name}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{service.duration} min</span>
                  <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" />{service.documents.length} docs</span>
                </div>
                <div className="mt-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Required Documents:</p>
                  <ul className="text-xs text-muted-foreground list-disc list-inside space-y-0.5">
                    {service.documents.map((d) => <li key={d}>{d}</li>)}
                  </ul>
                </div>
              </div>
              <button
                onClick={() => navigate(`/book-slot/${service.id}`)}
                className="shrink-0 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Book Slot
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </PageShell>
  );
};

export default ServiceCategory;
