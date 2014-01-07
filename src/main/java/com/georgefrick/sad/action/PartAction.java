package com.georgefrick.sad.action;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.Action;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import com.georgefrick.fun.Part;
import com.georgefrick.fun.PartsResource;
import com.georgefrick.sad.form.MainForm;

/**
 * @author gitter
 * 
 * This Action handles CRUD actions on the Part objects
 */
public class PartAction extends Action {
	private static final PartsResource resource = new PartsResource();
	
	@Override
	public ActionForward execute(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		String action = request.getParameter("action");
		
		if (action.equals("save")) {
			// parse the part
			Part part = MainForm.parsePart(request.getParameterMap());
			
			// save the part
			resource.createPart(part);
		} else if (action.equals("delete")) {
			// get the id
			String id = request.getParameter("id");
			
			// delete the part
			resource.deletePart(Long.parseLong(id));
		}
		
		// redirect the user back to the parts view
		return mapping.findForward("parts");
	}
}
